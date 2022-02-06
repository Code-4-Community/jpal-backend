import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { mockResearcher, mockUser } from '../user/user.service.spec';
import { User } from 'src/user/types/user.entity';
import { SurveyTemplate } from 'src/surveyTemplate/types/surveyTemplate.entity';

export const UUID = '123e4567-e89b-12d3-a456-426614174000';

export const mockSurveyTemplate: SurveyTemplate = {
  id: 1,
  creator: mockUser,
  questions: [],
};

export const mockSurvey: Survey = {
  id: 1,
  uuid: UUID,
  surveyTemplate: mockSurveyTemplate,
  name: "Survey 1",
  creator: mockUser
}

export const mockSurvey2: Survey = {
  id: 2,
  uuid: UUID,
  surveyTemplate: mockSurveyTemplate,
  name: "Survey 2",
  creator: mockResearcher
}

export const listMockSurveys: Survey[] = [mockSurvey, mockSurvey2]

export const mockSurveyService: Partial<SurveyService> = {
  async create(surveyTemplateId: number, name: string, creator: User): Promise<Survey> {
    return {
      id: 1,
      uuid: UUID,
      surveyTemplate: mockSurveyTemplate,
      name,
      creator,
    };
  },
  async getByUUID(): Promise<Survey> {
    return mockSurvey;
  },

  findAllSurveysByUser: jest.fn(() => Promise.resolve([mockSurvey])),
  getAllSurveys: jest.fn(() => Promise.resolve(listMockSurveys)),
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
        name: 'Survey 1',
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
    expect(await controller.findAllSurveys(mockUser)).toEqual([mockSurvey]);
    expect(mockSurveyService.findAllSurveysByUser).toHaveBeenCalled();
  });
  it('should get all surveys for researcher', async () => {
    expect(await controller.findAllSurveys(mockResearcher)).toEqual(listMockSurveys);
    expect(mockSurveyService.getAllSurveys).toHaveBeenCalled();
  })
});
