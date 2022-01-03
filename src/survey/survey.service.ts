import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './types/survey.entity';
import { User } from '../user/types/user.entity';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { CreateBatchAssignmentsDto } from './dto/create-batch-assignments.dto';
import { Assignment } from '../assignment/types/assignment.entity';
import { Youth } from '../youth/types/youth.entity';
import { Reviewer } from '../reviewer/types/reviewer.entity';

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
    });
  }

  async getByUUID(uuid: string): Promise<Survey> {
    return this.surveyRepository.findOneOrFail({ uuid });
  }

  async findAllSurveys(user: User): Promise<Survey[]> {
    return this.surveyRepository.find({
      where: { creator: user },
    });
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
}
