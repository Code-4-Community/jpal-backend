import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { mockUser } from '../user/user.service.spec';
import { DeepPartial, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';

export const mockSurveyTemplate: SurveyTemplate = {
  id: 1,
  creator: mockUser,
  questions: [],
};

const UUID = '123e4567-e89b-12d3-a456-426614174000';

export const mockSurvey: Survey = {
  id: 1,
  uuid: UUID,
  name: 'Test Survey',
  surveyTemplate: mockSurveyTemplate,
  creator: mockUser,
};

const listMockSurveys: Survey[] = [mockSurvey];

const mockSurveyRepository: Partial<Repository<Survey>> = {
  create(survey?: DeepPartial<Survey> | DeepPartial<Survey>[]): any {
    return {
      id: 1,
      uuid: UUID,
      ...survey,
    };
  },
  save<T>(survey): T {
    return survey;
  },
  findOne(): any {
    return undefined;
  },
  find(): Promise<Survey[]> {
    return Promise.resolve(listMockSurveys);
  },
  findOneOrFail(): Promise<Survey> {
    return Promise.resolve(mockSurvey);
  },
};

const mockSurveyTemplateRepository: Partial<Repository<SurveyTemplate>> = {
  async findOne() {
    return mockSurveyTemplate;
  },
  async findOneOrFail(): Promise<SurveyTemplate> {
    return mockSurveyTemplate;
  },
};

describe('SurveyService', () => {
  let service: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getRepositoryToken(Survey),
          useValue: mockSurveyRepository,
        },
        {
          provide: getRepositoryToken(SurveyTemplate),
          useValue: mockSurveyTemplateRepository,
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a survey', async () => {
    const survey = await service.create(
      mockSurveyTemplate.id,
      mockSurvey.name,
      mockSurvey.creator,
    );
    expect(survey).toEqual(mockSurvey);
  });

  it('should return the survey by uuid', async () => {
    const survey = await service.getByUUID(UUID);
    expect(survey).toEqual(mockSurvey);
  });

  it('should throw an error when survey does not exist', async () => {
    await expect(service.getByUUID('123')).rejects.toThrow();
  });

  it('should fetch all surveys created by current user', async () => {
    const goodResponse = await service.findAllSurveys(mockUser);
    expect(goodResponse).toEqual(listMockSurveys);
  });
});
