import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { User } from '../user/types/user.entity';
import { mockSurveyTemplate } from './survey.service.spec';

export const mockSurveyService: Partial<SurveyService> = {
  async create(surveyTemplateId: number, name: string, creator: User): Promise<Survey> {
    return {
      id: 1,
      surveyTemplate: mockSurveyTemplate,
      name,
      creator,
    };
  },
};
