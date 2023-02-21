import { BadRequestException, Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './types/survey.entity';
import { User } from '../user/types/user.entity';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { CreateBatchAssignmentsDto, PersonInfo } from './dto/create-batch-assignments.dto';
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
    return this.surveyRepository.create({
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
    const pairArray = dto.pairs;
    const shuffleArray = () : void => {
      for (let i = pairArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = pairArray[i];
        pairArray[i] = pairArray[j];
        pairArray[j] = temp;
      }
    }

    const [youth, reviewers] = await Promise.all([ // Split here
      this.youthRepository.save(pairArray.map((p, index) =>  {
        index % 2 == 0 ? p.youth.role = YouthRoles.CONTROL : p.youth.role = YouthRoles.TREATMENT
        return p.youth;
      })),
      this.reviewerRepository.save(pairArray.map((p) => p.reviewer)),
    ]);
    /*
     * Assumes that if there is a collision (by email) of one of the youths or reviewers, the corresponding value
     * in the returned array is the entity that already exists. This is likely to be true but needs testing to confirm.
     */
    await this.assignmentRepository.save(
      dto.pairs.map((pair, i) => {
        return {
          survey,
          reviewer: reviewers[i],
          youth: youth[i],
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
      questions: this.transformQuestionToSurveyDataQuestion(questionEntities),
    };
  }

  private transformReviewerToSurveyDataReviewer(reviewerEntity: Reviewer) {
    return {
      firstName: reviewerEntity.firstName,
      lastName: reviewerEntity.lastName,
      email: reviewerEntity.email,
    };
  }

  private transformQuestionToSurveyDataQuestion(
    questionEntities: Question[],
  ): SurveyDataQuestion[] {
    return questionEntities.map((q) => ({
      question: q.text,
      options: q.options.map((o) => o.text),
    }));
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
}
