import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { mockUser, mockUser2 } from '../user/user.service.spec';
import { DeepPartial, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { Assignment } from '../assignment/types/assignment.entity';
import { Reviewer } from 'src/reviewer/types/reviewer.entity';
import { Youth } from 'src/youth/types/youth.entity';

export const mockSurveyTemplate: SurveyTemplate = {
  id: 1,
  creator: mockUser,
  questions: [],
};

const UUID = '123e4567-e89b-12d3-a456-426614174000';
const UUID2 = 'a48bea54-4948-4f38-897e-f47a042c891d';

export const mockReviewer: Reviewer = {
  id: 1,
  uuid: `1234`,
  email: `mock@reviewer.com`,
  firstName: `Mock`,
  lastName: `Reviewer`,
};

export const mockReviewer2: Reviewer = {
  id: 2,
  uuid: `123443`,
  email: `mock2@reviewer.com`,
  firstName: `Mock2`,
  lastName: `Reviewer2`,
};

export const mockYouth: Youth = {
  id: 1,
  email: `mock@youth.com`,
  firstName: `Mock`,
  lastName: `Youth`,
};

export const mockSurvey: Survey = {
  id: 1,
  uuid: UUID,
  name: 'Test Survey',
  surveyTemplate: mockSurveyTemplate,
  creator: mockUser,
  assignments: [],
};

export const mockSurvey2: Survey = {
  id: 2,
  uuid: UUID2,
  name: 'Test Survey 2',
  surveyTemplate: mockSurveyTemplate,
  creator: mockUser2,
  assignments: [],
};

export const mockAssignment: Assignment = {
  id: 1,
  uuid: '123',
  survey: mockSurvey,
  reviewer: mockReviewer,
  youth: mockYouth,
  completed: false,
  responses: [],
};

export const mockAssignment2: Assignment = {
  id: 2,
  uuid: '1234',
  survey: mockSurvey2,
  reviewer: mockReviewer2,
  youth: mockYouth,
  completed: false,
  responses: [],
};

mockSurvey.assignments = [mockAssignment2];

export const mockAssignments: Assignment[] = [mockAssignment];
const listMockSurveys: Survey[] = [mockSurvey, mockSurvey2];

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
      mockSurvey.assignments,
    );
    expect(survey).toEqual(mockSurvey);
  });

  it('should return the survey by uuid', async () => {
    const survey = await service.getByUUID(UUID);
    expect(survey).toEqual(mockSurvey);
  });

  it('should fetch all surveys created by current user', async () => {
    const goodResponse = await service.findAllSurveys(mockUser);
    expect(goodResponse).toEqual(listMockSurveys);
  });

  it('should filter the assignments of the survey because the given reviewer uuid does not match', async () => {
    console.log('before filtering', mockSurvey);
    const goodResponse = await service.getBySurveyAndReviewerUUID(
      UUID,
      mockReviewer.uuid,
    );
    console.log(goodResponse);

    console.log(mockSurvey);
    expect(goodResponse).toEqual(mockSurvey);
  });

  it('should not filter the assignments because the given reviewer uuid does match', async () => {
    const goodResponse = await service.getBySurveyAndReviewerUUID(
      UUID,
      mockReviewer2.uuid,
    );

    expect(goodResponse).toEqual(mockSurvey);
  });
});
