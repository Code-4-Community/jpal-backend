import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './types/survey.entity';
import { User } from '../user/types/user.entity';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { Assignment } from '../assignment/types/assignment.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey) private surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
  ) {}

  async create(
    surveyTemplateId: number,
    name: string,
    creator: User,
    assignments: Assignment[],
  ): Promise<Survey> {
    const surveyTemplate = await this.surveyTemplateRepository.findOneOrFail({
      id: surveyTemplateId,
    });
    return this.surveyRepository.create({
      surveyTemplate,
      name,
      creator,
      assignments,
    });
  }

  async getByUUID(uuid: string): Promise<Survey> {
    return this.surveyRepository.findOneOrFail({ uuid });
  }

  async getBySurveyAndReviewerUUID(surveyUUID: string, reviewerUUID: string): Promise<Survey> {
    const survey = await this.getByUUID(surveyUUID);

    console.log('this is from survey service');
    console.log('survey for the survey uuid ', survey);

    return survey;
  }

  async findAllSurveys(user: User): Promise<Survey[]> {
    return this.surveyRepository.find({
      where: { creator: user },
    });
  }
}
