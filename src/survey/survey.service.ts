import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey) private surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Youth) private youthRepository: Repository<Youth>,
    @InjectRepository(Reviewer)
    private reviewerRepository: Repository<Reviewer>,
  ) {}

  async create(surveyTemplateId: number, name: string, creator: User) {
    const surveyTemplate = await this.surveyTemplateRepository.findOneOrFail({
      id: surveyTemplateId,
    });
    return this.surveyRepository.create({
      surveyTemplate,
      name,
      creator,
      assignments: [],
    });
  }

  async getByUUID(uuid: string): Promise<Survey> {
    return this.surveyRepository.findOneOrFail({ uuid });
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
   * @param dto
   */
  async createBatchAssignments(dto: CreateBatchAssignmentsDto) {
    const survey = await this.getByUUID(dto.surveyUUID);
    const [youth, reviewers] = await Promise.all([
      this.youthRepository.save(dto.pairs.map((p) => p.youth)),
      this.reviewerRepository.save(dto.pairs.map((p) => p.reviewer)),
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
    const reviewer = await this.reviewerRepository.findOne({ where: { uuid: reviewerUuid } });

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
