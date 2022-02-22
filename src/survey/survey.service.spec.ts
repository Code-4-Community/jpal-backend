import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { mockUser } from '../user/user.service.spec';
import { DeepPartial, FindConditions, FindManyOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { MockRepository } from '../../test/db/MockRepository';
import { Assignment } from '../assignment/types/assignment.entity';
import { Youth } from '../youth/types/youth.entity';
import { Reviewer } from '../reviewer/types/reviewer.entity';
import { CreateBatchAssignmentsDto } from './dto/create-batch-assignments.dto';
import { listMockSurveys, mockSurvey, mockSurveyTemplate, UUID } from './survey.controller.spec';

export const mockSurveyRepository: Partial<Repository<Survey>> = {
  create(survey?: DeepPartial<Survey> | DeepPartial<Survey>[]): any {
    return {
      id: 1,
      uuid: UUID,
      date: new Date("2-6'2022"),
      ...survey,
    };
  },
  save<T>(survey): T {
    return survey;
  },
  findOne(): any {
    return undefined;
  },
  find(options?: FindManyOptions<Survey> | FindConditions<Survey>): Promise<Survey[]> {
    // this checks to see if a find call is trying to filter the results by creator
    if (options && 'where' in options) {
      return Promise.resolve([mockSurvey]);
    }
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
    const goodResponse = await service.findAllSurveysByUser(mockUser);
    expect(goodResponse).toEqual([mockSurvey]);
  });

  it('should fetch all surveys', async () => {
    const goodResponse = await service.getAllSurveys();
    expect(goodResponse).toEqual(listMockSurveys);
  });

  it('should create batch assignments', async () => {
    const dto: CreateBatchAssignmentsDto = {
      surveyUUID: 'test',
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
    const youthSave = jest.spyOn(mockYouthRepository, 'save').mockImplementation((i) => i);
    const reviewerSave = jest.spyOn(mockReviewerRepository, 'save').mockImplementation((i) => i);
    const assignmentSave = jest.spyOn(mockAssignmentRepository, 'save');
    await service.createBatchAssignments(dto);
    expect(youthSave).toHaveBeenCalledWith([dto.pairs[0].youth]);
    expect(reviewerSave).toHaveBeenCalledWith([dto.pairs[0].reviewer]);
    expect(assignmentSave).toHaveBeenCalledWith([
      {
        survey: mockSurvey,
        reviewer: dto.pairs[0].reviewer,
        youth: dto.pairs[0].youth,
        responses: [],
      },
    ]);
  });
});
