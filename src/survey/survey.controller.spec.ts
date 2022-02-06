import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { mockSurvey, mockSurveyTemplate } from './survey.service.spec';
import { mockUser } from '../user/user.service.spec';
import { User } from 'src/user/types/user.entity';

const listMockSurveys: Survey[] = [];

const UUID = '123e4567-e89b-12d3-a456-426614174000';
export const mockSurveyService: Partial<SurveyService> = {
  async create(surveyTemplateId: number, name: string, creator: User): Promise<Survey> {
    return {
      id: 1,
      uuid: UUID,
      surveyTemplate: mockSurveyTemplate,
      name,
      creator,
      date: new Date('02-06-2022'),
    };
  },
  async getByUUID(): Promise<Survey> {
    return mockSurvey;
  },

  findAllSurveys: jest.fn(() => Promise.resolve(listMockSurveys)),
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

  it('should return a survey by its uuid', async () => {
    const survey = await controller.getByUUID(UUID);
    expect(survey).toEqual(mockSurvey);
  });
  it('should find all the surveys created by the user', async () => {
    expect(await controller.findAllSurveys(mockUser)).toEqual(listMockSurveys);
    expect(mockSurveyService.findAllSurveys).toHaveBeenCalled();
  });
});
