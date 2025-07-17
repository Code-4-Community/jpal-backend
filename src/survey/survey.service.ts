import {
  BadRequestException,
  Logger,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Survey } from './types/survey.entity';
import { User } from '../user/types/user.entity';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { CreateBatchAssignmentsDto } from './dto/create-batch-assignments.dto';
import { Assignment } from '../assignment/types/assignment.entity';
import { Youth } from '../youth/types/youth.entity';
import { Reviewer } from '../reviewer/types/reviewer.entity';
import { AssignmentStatus } from '../assignment/types/assignmentStatus';
import { YouthRoles } from '../youth/types/youthRoles';
import { Question } from '../question/types/question.entity';
import { SurveyData } from './dto/survey-assignment.dto';
import { Youth as SurveyDataYouth } from './dto/survey-assignment.dto';
import { Question as SurveyDataQuestion } from './dto/survey-assignment.dto';
import { EmailService } from '../util/email/email.service';
import { Role } from '../user/types/role';
import { transformQuestionToSurveyDataQuestion } from '../util/transformQuestionToSurveryDataQuestion';
import { SurveyTemplateData } from '../surveyTemplate/surveyTemplate.service';
import { AWSS3Service } from '../aws/aws-s3.service';
import * as process from 'process';
import { s3Buckets } from '../aws/types/s3Buckets';

@Injectable()
export class SurveyService {
  private logger = new Logger(SurveyService.name);

  constructor(
    @InjectRepository(Survey) private surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Youth) private youthRepository: Repository<Youth>,
    @InjectRepository(Reviewer)
    private reviewerRepository: Repository<Reviewer>,
    private emailService: EmailService,
    private awsS3Service: AWSS3Service,
  ) {}

  async create(
    surveyTemplateId: number,
    name: string,
    creator: User,
    organizationName: string,
    imageBase64: string,
    treatmentPercentage: number,
  ) {
    const surveyTemplate = await this.surveyTemplateRepository.findOne({
      id: surveyTemplateId,
    });
    if (!surveyTemplate) {
      throw new BadRequestException('Requested survey template does not exist');
    }

    const imageURL = await this.processImage(imageBase64, organizationName);

    return this.surveyRepository.save({
      surveyTemplate,
      name,
      creator,
      assignments: [],
      imageURL,
      organizationName,
      treatmentPercentage,
    });
  }

  async edit(id: number, surveyName?: string, organizationName?: string, imageData?: string, treatmentPercentage?: number): Promise<Survey> {
    const survey = await this.getById(id);
    let found = false;
    if (surveyName) {
      survey.name = surveyName;
      found = true;
    }
    if (organizationName) {
      survey.organizationName = organizationName;
      found = true;
    }
    if (imageData) {
      survey.imageURL = await this.processImage(imageData, organizationName);
      found = true;
    }
    if (treatmentPercentage) {
      found = true;
      if (treatmentPercentage < 0 || treatmentPercentage > 100) {
        throw new BadRequestException(`${treatmentPercentage} is not between 0 and 100 inclusive`)
      }
      survey.treatmentPercentage = treatmentPercentage;
    }
    if (!found) {
      throw new BadRequestException('At least one of surveyName, organizationName, imageData, or treatmentPercentage must be provided');
    }
    return await this.surveyRepository.save(survey);
  }

  isBase64Image = (base64String: string): boolean => {
    const jpgRegex = /^\/9j\/.*$/;
    const pngRegex = /^iVB.*$/;
    return jpgRegex.test(base64String) || pngRegex.test(base64String);
  }

  /**
   * Gets the survey corresponding to id.
   */
  async getById(id: number): Promise<Survey> {
    const result = await this.surveyRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new BadRequestException(`Survey  id ${id} not found`);
    }

    return result;
  }

  /**
   * Creates a batch of Assignments given a surveyId and a list of pairs of Reviewers and Youth.
   * Creates the Reviewers and Youth if they don't exist.
   * Sends emails containing a link to the survey to each of the reviewers for each of the youth
   * @param dto
   */
  async createBatchAssignments(dto: CreateBatchAssignmentsDto) {
    const survey = await this.getByUUID(dto.surveyUUID);
    const reviewers = dto.pairs.map((p) => p.reviewer);
    const reviewerEmails = reviewers.map((r) => r.email);
    const treatmentPercentageFraction = survey.treatmentPercentage / 100;

    const youth = dto.pairs.map((p) => {
      /**
       * Randomly assign youth to a group weighted by the survey's treatment percentage
       * This may not be the 100% best way, but I think we can keep it simple for now
       */
      const youthRole =
        Math.random() < treatmentPercentageFraction ? YouthRoles.TREATMENT : YouthRoles.CONTROL;
      return { ...p.youth, role: youthRole };
    });
    const youthEmails = youth.map((y) => y.email);

    // If we're given any existing reviewer-youth pairs for this survey, treat it as an invalid request and require the caller to remove them
    const existingAssignments = await this.assignmentRepository.find({
      relations: ['reviewer', 'youth'],
      where: {
        survey: survey,
        reviewer: { email: In(reviewerEmails) },
        youth: { email: In(youthEmails) },
      },
    });

    if (existingAssignments.length > 0) {
      const assignmentInfo = existingAssignments.map((a) => ({
        reviewer: {
          firstName: a.reviewer.firstName,
          lastName: a.reviewer.lastName,
          email: a.reviewer.email,
        },
        youth: { firstName: a.youth.firstName, lastName: a.youth.lastName, email: a.youth.email },
      }));
      throw new BadRequestException({
        message: 'Attempted to create assignments that already exist for this survey',
        assignmentInfo,
      });
    }

    // These reviewers or youths might already be in another survey
    // If they are, just ignore them when inserting - this will only create records for never-before-seen reviewe
    await Promise.all([
      this.youthRepository.createQueryBuilder().insert().values(youth).orIgnore().execute(),
      this.reviewerRepository.createQueryBuilder().insert().values(reviewers).orIgnore().execute(),
    ]);

    // Need to retrieve the given database entities to tell TypeORM to associate the new assignments with them instead of trying to create new records
    const [reviewerEntities, youthEntities] = await Promise.all([
      this.reviewerRepository.find({ where: { email: In(reviewerEmails) } }),
      this.youthRepository.find({ where: { email: In(youthEmails) } }),
    ]);

    // If we get here, then none of the given reviewer-youth pairs should exist for this survey
    await this.assignmentRepository.save(
      dto.pairs.map((_, i) => {
        return {
          survey,
          reviewer: reviewerEntities[i],
          youth: youthEntities[i],
          responses: [],
        };
      }),
    );
  }

  /**
   * Sends an email to each of the reviewers for each of the youth they are assigned to
   * @param dto
   */
  async sendEmailToReviewersInBatchAssignment(dto: CreateBatchAssignmentsDto): Promise<void> {
    await Promise.all(
      dto.pairs.map(async (pair) => {
        try {
          // queue the email to be sent to the reviewer with the link to /survey/:survey_id/:reviewer_id
          const reviewerInfo = pair.reviewer;
          const reviewer: Reviewer = await this.reviewerRepository.findOne({
            firstName: reviewerInfo.firstName,
            lastName: reviewerInfo.lastName,
          });
          if (!reviewer) {
            throw new BadRequestException(
              `Requested reviewer (${reviewerInfo.firstName} ${reviewerInfo.lastName}) does not exist`,
            );
          }
          const subject: string = this.emailSubject(reviewer.firstName, reviewer.lastName);
          const emailBodyHTML: string = this.generateEmailBodyHTML(dto.surveyUUID, reviewer.uuid);

          await this.emailService.queueEmail(reviewer.email, subject, emailBodyHTML);
        } catch (e) {
          this.logger.error(e);
        }
      }),
    );
  }

  /**
   * Returns the subject line of the email sent to reviewers
   * @param firstName
   * @param lastName
   * @returns the subject line
   */
  emailSubject(firstName: string, lastName: string): string {
    // TODO: replace with actual subject
    return `Survey assignments for ${firstName} ${lastName}`;
  }

  /**
   * Returns the HTML comprising the body of the email with a link to /survey/{surveyUUID}/{reviewerUUID}
   * @param surveyUUID
   * @param reviewerUUID
   * @returns the email body HTML with a link to /survey/{surveyUUID}/{reviewerUUID}
   */
  generateEmailBodyHTML(surveyUUID: string, reviewerUUID: string): string {
    const domain = process.env.PROD_URL || 'http://localhost:5000';
    const link = `${domain}/survey/${surveyUUID}/${reviewerUUID}`;
    return `
      <html>
        <body>
          <header><h1>Header goes here!</h1></header>
          <main>
            <p> First paragraph of text. </p> 
            <p> Second paragraph of text. </p>
            <p> Third paragraph of text. Please use <a href=${link}>this survey link</a> to generate recommendation letters. </p>
            <p> Thank you, <br> JPAL </p>
          </main>
        </body>
      </html>
    `;
  }

  async getReviewerSurvey(surveyUuid: string, reviewerUuid: string): Promise<SurveyData> {
    const survey = await this.surveyRepository.findOne({
      where: { uuid: surveyUuid },
      relations: [
        'assignments',
        'assignments.reviewer',
        'assignments.youth',
        'surveyTemplate',
        'surveyTemplate.questions',
        'surveyTemplate.questions.options',
      ],
    });

    if (survey === undefined) {
      throw new BadRequestException(`Survey with uuid ${surveyUuid} does not exist`);
    }

    const reviewer = await this.reviewerRepository.findOne({ where: { uuid: reviewerUuid } });

    if (reviewer === undefined) {
      throw new BadRequestException(`Reviewer with uuid ${reviewerUuid} does not exist`);
    }

    const assignmentsForReviewer = survey.assignments.filter(
      (assignment) =>
        assignment.reviewer.id === reviewer.id && assignment.status === AssignmentStatus.INCOMPLETE,
    );

    if (assignmentsForReviewer.length === 0) {
      throw new BadRequestException('Reviewer is not invited to complete this survey');
    }

    const response = this.transformToFrontendSurveyData(
      assignmentsForReviewer,
      survey.surveyTemplate.questions,
      reviewer,
    );

    return response;
  }

  transformToFrontendSurveyData(
    assignmentsForReviewer: Assignment[],
    questionEntities: Question[],
    reviewerEntity: Reviewer,
  ) {
    return {
      reviewer: this.transformReviewerToSurveyDataReviewer(reviewerEntity),
      controlYouth: this.extractYouthByRole(YouthRoles.CONTROL, assignmentsForReviewer),
      treatmentYouth: this.extractYouthByRole(YouthRoles.TREATMENT, assignmentsForReviewer),
      questions: transformQuestionToSurveyDataQuestion(questionEntities),
    };
  }

  async getByUUID(uuid: string): Promise<Survey> {
    const survey = this.surveyRepository.findOne({ where: { uuid } });
    if (!survey) {
      throw new BadRequestException('Requested survey does not exist');
    }
    return survey;
  }

  async findAllSurveysByUser(user: User): Promise<Survey[]> {
    return this.surveyRepository.find({
      where: { creator: user },
    });
  }

  async getAllSurveys(): Promise<Survey[]> {
    return this.surveyRepository.find();
  }

  /**
   * Processes an image by converting it from base64 to a buffer and uploading it to AWS S3.
   * 
   * @param imageBase64 image in base64 format
   * @param organizationName organization name to use in the file name
   * @returns the URL of the uploaded image in S3
   */
  async processImage(imageBase64: string, organizationName: string): Promise<string> {
    const matches = imageBase64.match(/^data:(.*);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
      throw new BadRequestException('Invalid base64 image format');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const fileName = `${organizationName}-image${Date.now()}.${mimeType.substring(6)}`;
    return this.awsS3Service.upload(buffer, fileName, mimeType, s3Buckets.IMAGES);
  }

  private transformReviewerToSurveyDataReviewer(reviewerEntity: Reviewer) {
    return {
      firstName: reviewerEntity.firstName,
      lastName: reviewerEntity.lastName,
      email: reviewerEntity.email,
    };
  }

  private extractYouthByRole(youthRole: YouthRoles, assignments: Assignment[]): SurveyDataYouth[] {
    return assignments
      .filter((a) => a.youth.role === youthRole)
      .map(this.extractYouthFromAssignment);
  }
  private extractYouthFromAssignment(a: Assignment): SurveyDataYouth {
    return {
      assignmentUuid: a.uuid,
      firstName: a.youth.firstName,
      lastName: a.youth.lastName,
      email: a.youth.email,
    };
  }

  async getSurveyAssignments(uuid: string, user: User) {
    const survey = await this.surveyRepository.findOne({
      where: { uuid },
      relations: ['creator', 'assignments', 'assignments.reviewer', 'assignments.youth'],
    });

    if (survey === undefined) {
      throw new NotFoundException(`Requested survey does not exist`);
    }

    if (user.role === Role.ADMIN && survey.creator.id !== user.id) {
      throw new UnauthorizedException();
    }

    return survey;
  }
}
