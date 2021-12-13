import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { User } from '../user/types/user.entity';
import { mockSurvey, mockSurveyTemplate } from './survey.service.spec';
import { mockUser } from '../user/user.service.spec';

const mockSurveyService: Partial<SurveyService> = {
  async create(surveyTemplateId: number, name: string, creator: User): Promise<Survey> {
    return {
      id: 1,
      surveyTemplate: mockSurveyTemplate,
      name,
      creator,
    };
  },
};

describe('SurveyController', () => {
  let controller: SurveyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        {
          provide: SurveyService,
          useValue: mockSurveyService,
        },
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const survey = await controller.create(
      {
        name: 'Test Survey',
        surveyTemplateId: 1,
      },
      mockUser,
    );
    expect(survey).toEqual(mockSurvey);
  });
});
