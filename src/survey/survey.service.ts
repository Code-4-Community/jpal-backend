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
  ) {}

  async create(surveyTemplateId: number, name: string, creator: User) {
    const surveyTemplate = await this.surveyTemplateRepository.findOne({
      id: surveyTemplateId,
    });
    if (!surveyTemplate) {
      throw new BadRequestException('Requested survey template does not exist');
    }
    return this.surveyRepository.save({
      surveyTemplate,
      name,
      creator,
      assignments: [],
    });
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
   * Creates a batch of Assignments given a surveyId and a list of pairs of Reviewers and Youth.
   * Creates the Reviewers and Youth if they don't exist.
   * Sends emails containing a link to the survey to each of the reviewers for each of the youth
   * @param dto
   */
  async createBatchAssignments(dto: CreateBatchAssignmentsDto) {
    const survey = await this.getByUUID(dto.surveyUUID);
    const reviewers = dto.pairs.map((p) => p.reviewer);
    const reviewerEmails = reviewers.map((r) => r.email);
    const youth = dto.pairs.map((p) => p.youth);
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

  async updateSurveyName(surveyUUID: string, name: string, user: User): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      where: { uuid: surveyUUID },
      relations: ['creator'],
    });

    if (!survey) {
      throw new BadRequestException(`Survey with UUID: ${surveyUUID} not found`);
    }

    const isAdminAndCreator = user.role === Role.ADMIN && survey.creator.id === user.id;
    const isResearcher = user.role === Role.RESEARCHER;

    if (!isResearcher && !isAdminAndCreator) {
      throw new BadRequestException(`You do not have permission to update this survey`);
    }

    survey.name = name;
    return await this.surveyRepository.save(survey);
  }
}
