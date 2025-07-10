import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { mockResearcher, mockUser } from '../user/user.service.spec';
import { DeepPartial, FindConditions, FindManyOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { MockRepository } from '../../test/db/MockRepository';
import { Assignment } from '../assignment/types/assignment.entity';
import { Youth } from '../youth/types/youth.entity';
import { Reviewer } from '../reviewer/types/reviewer.entity';
import { CreateBatchAssignmentsDto } from './dto/create-batch-assignments.dto';
import {
  listMockSurveys,
  mockSurvey,
  mockSurvey2,
  mockSurveyTemplate,
  UUID,
} from './survey.controller.spec';
import { UtilModule } from '../util/util.module';
import { EmailService } from '../util/email/email.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AWSS3Service } from '../aws/aws-s3.service';

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
    return {
      id: 1,
      uuid: UUID,
      date: new Date("2-6'2022"),
      ...survey,
    };
  },
  find(options?: FindManyOptions<Survey> | FindConditions<Survey>): Promise<Survey[]> {
    // this checks to see if a find call is trying to filter the results by creator
    if (options && 'where' in options) {
      return Promise.resolve([mockSurvey]);
    }
    return Promise.resolve(listMockSurveys);
  },
  findOne(): Promise<Survey> {
    return Promise.resolve(mockSurvey);
  },
};

export const mockSurveyTemplateRepository: Partial<Repository<SurveyTemplate>> = {
  async findOne() {
    return mockSurveyTemplate;
  },
};

const mockEmailService: Partial<EmailService> = {
  queueEmail: jest.fn(),
};

const mockS3Service: Partial<AWSS3Service> = {
  upload: jest.fn().mockResolvedValue('https://jpal-letters.s3.us-east-2.amazonaws.com/1-1LOR.pdf'),
  createLink: jest
    .fn()
    .mockResolvedValue('https://jpal-letters.s3.us-east-2.amazonaws.com/1-1LOR.pdf'),
  getImageData: jest.fn().mockResolvedValue(null),
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
      imports: [UtilModule],
      providers: [
        SurveyService,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
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
        {
          provide: AWSS3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a survey', async () => {
    const survey = await service.create(
      mockSurveyTemplate.id,
      mockSurvey.name,
      mockSurvey.creator,
      mockSurvey.organizationName,
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
      mockSurvey.treatmentPercentage,
    );
    expect(survey).toMatchObject({
      uuid: mockSurvey.uuid,
      name: mockSurvey.name,
      id: mockSurvey.id,
      organizationName: mockSurvey.organizationName,
      imageURL: mockSurvey.imageURL,
      treatmentPercentage: mockSurvey.treatmentPercentage,
    });
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
    const assignmentSave = jest.spyOn(mockAssignmentRepository, 'save');

    const youthCreateQB = jest.spyOn(mockYouthRepository, 'createQueryBuilder');
    const reviewerCreateQB = jest.spyOn(mockReviewerRepository, 'createQueryBuilder');
    const youthFind = jest
      .spyOn(mockYouthRepository, 'find')
      .mockReturnValueOnce([dto.pairs[0].youth]);
    const reviewerFind = jest
      .spyOn(mockReviewerRepository, 'find')
      .mockReturnValueOnce([dto.pairs[0].reviewer]);

    await service.createBatchAssignments(dto);
    expect(youthCreateQB).toHaveBeenCalled();
    expect(reviewerCreateQB).toHaveBeenCalled();
    expect(youthFind).toHaveBeenCalled();
    expect(reviewerFind).toHaveBeenCalled();
    expect(assignmentSave).toHaveBeenCalledWith([
      {
        survey: mockSurvey,
        reviewer: dto.pairs[0].reviewer,
        youth: dto.pairs[0].youth,
        responses: [],
      },
    ]);
  });

  it('should email reviewers survey link after creating batch assignments', async () => {
    const reviewer1 = {
      id: 1,
      uuid: 'test1',
      email: 'alpha@sgmail.com',
      firstName: 'Alpha',
      lastName: 'Beta',
    };
    const reviewer2 = {
      id: 2,
      uuid: 'test2',
      email: 'epsilon@sgmail.com',
      firstName: 'Epsilon',
      lastName: 'Omega',
    };

    mockReviewerRepository.save(reviewer1);
    mockReviewerRepository.save(reviewer2);

    const surveyUUID = 'test';
    const dto: CreateBatchAssignmentsDto = {
      surveyUUID: surveyUUID,
      pairs: [
        {
          reviewer: {
            email: reviewer1.email,
            firstName: reviewer1.firstName,
            lastName: reviewer1.lastName,
          },
          youth: {
            email: 'gamma@gmail.com',
            firstName: 'Gamma',
            lastName: 'Delta',
          },
        },
        {
          reviewer: {
            email: reviewer2.email,
            firstName: reviewer2.firstName,
            lastName: reviewer2.lastName,
          },
          youth: {
            email: 'kappa@gmail.com',
            firstName: 'Kappa',
            lastName: 'Iota',
          },
        },
      ],
    };

    await service.createBatchAssignments(dto);
    await service.sendEmailToReviewersInBatchAssignment(dto);

    expect(mockEmailService.queueEmail).toHaveBeenCalledTimes(2);
    expect(mockEmailService.queueEmail).toHaveBeenNthCalledWith(
      1,
      reviewer1.email,
      service.emailSubject(reviewer1.firstName, reviewer1.lastName),
      service.generateEmailBodyHTML(surveyUUID, reviewer1.uuid),
    );
    expect(mockEmailService.queueEmail).toHaveBeenNthCalledWith(
      2,
      reviewer2.email,
      service.emailSubject(reviewer2.firstName, reviewer2.lastName),
      service.generateEmailBodyHTML(surveyUUID, reviewer2.uuid),
    );
  });

  describe('getSurveyAssignments', () => {
    it('should get the survey as a researcher', async () => {
      // mockSurvey2 creator === mockResearcher
      jest
        .spyOn(mockSurveyRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockSurvey2));
      expect(await service.getSurveyAssignments(UUID, mockResearcher)).toEqual(mockSurvey2);

      // mockSurvey creator !== mockResearcher (it's mockUser)
      jest
        .spyOn(mockSurveyRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockSurvey));
      expect(await service.getSurveyAssignments(UUID, mockResearcher)).toEqual(mockSurvey);
    });

    it("should throw a NotFoundException if the requested survey doesn't exist", async () => {
      jest
        .spyOn(mockSurveyRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));
      await expect(service.getSurveyAssignments(UUID, mockResearcher)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw if requesting admin isn't the creator", async () => {
      jest
        .spyOn(mockSurveyRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockSurvey2));
      await expect(service.getSurveyAssignments(UUID, mockUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
