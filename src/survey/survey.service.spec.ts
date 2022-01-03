import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { mockUser } from '../user/user.service.spec';
import { DeepPartial, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { MockRepository } from '../../test/db/MockRepository';
import { Assignment } from '../assignment/types/assignment.entity';
import { Youth } from '../youth/types/youth.entity';
import { Reviewer } from '../reviewer/types/reviewer.entity';
import { CreateBatchAssignmentsDto } from './dto/create-batch-assignments.dto';

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

export const mockSurveyRepository: Partial<Repository<Survey>> = {
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

export const mockSurveyTemplateRepository: Partial<Repository<SurveyTemplate>> = {
  async findOne() {
    return mockSurveyTemplate;
  },
  async findOneOrFail(): Promise<SurveyTemplate> {
    return mockSurveyTemplate;
  },
};

describe('SurveyService', () => {
  let service: SurveyService;
  let mockAssignmentRepository: MockRepository<Assignment>;
  let mockYouthRepository: MockRepository<Youth>;
  let mockReviewerRepository: MockRepository<Reviewer>;

  beforeEach(async () => {
    mockAssignmentRepository = new MockRepository<Assignment>();
    mockYouthRepository = new MockRepository<Youth>();
    mockReviewerRepository = new MockRepository<Reviewer>();
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
        {
          provide: getRepositoryToken(Assignment),
          useValue: mockAssignmentRepository,
        },
        {
          provide: getRepositoryToken(Youth),
          useValue: mockYouthRepository,
        },
        {
          provide: getRepositoryToken(Reviewer),
          useValue: mockReviewerRepository,
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a survey', async () => {
    const survey = await service.create(mockSurveyTemplate.id, mockSurvey.name, mockSurvey.creator);
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

  it('should create batch assignments', async () => {
    const dto: CreateBatchAssignmentsDto = {
      surveyUUID: "test",
      pairs: [
        {
          reviewer: {
            email: 'alpha@sgmail.com',
            firstName: 'Alpha',
            lastName: 'Beta',
          },
          youth: {
            email: 'gamma@gmail.com',
            firstName: 'Gamma',
            lastName: 'Delta',
          },
        },
      ],
    };
    const youthSave = jest.spyOn(mockYouthRepository, 'save');
    const reviewerSave = jest.spyOn(mockReviewerRepository, 'save');
    const assignmentCreate = jest.spyOn(mockAssignmentRepository, 'create');
    await service.createBatchAssignments(dto);
    expect(youthSave).toHaveBeenCalledWith([dto.pairs[0].youth]);
    expect(reviewerSave).toHaveBeenCalledWith([dto.pairs[0].reviewer]);
    expect(assignmentCreate).toHaveBeenCalledWith({
      survey: mockSurvey,
      reviewer: dto.pairs[0].reviewer,
      youth: dto.pairs[0].youth,
      responses: [],
    });
  });
});
