import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { User } from '../user/types/user.entity';
import { mockSurveyTemplate } from './survey.controller.spec';

export const mockSurveyService: Partial<SurveyService> = {
  async create(surveyTemplateId: number, name: string, creator: User): Promise<Survey> {
    return {
      id: 1,
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      surveyTemplate: mockSurveyTemplate,
      name,
      creator,
      assignments: [],
      date: new Date('02-06-2022'),
    };
  },
};
