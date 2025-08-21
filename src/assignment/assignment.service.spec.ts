import { Test, TestingModule } from '@nestjs/testing';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment } from './types/assignment.entity';
import { AssignmentService } from './assignment.service';
import { mockSurvey } from '../survey/survey.controller.spec';
import { reviewerExamples } from '../reviewer/reviewer.examples';
import { youthExamples } from '../youth/youth.examples';
import { AssignmentStatus } from './types/assignmentStatus';
import { Reviewer } from '../reviewer/types/reviewer.entity';
import { Youth } from '../youth/types/youth.entity';
import { SurveyResponseDto } from './dto/survey-response.dto';
import DEFAULT_QUESTIONS, { exampleOptions } from '../question/question.examples';
import { Question } from '../question/types/question.entity';
import { mock } from 'jest-mock-extended';
import { Option } from '../option/types/option.entity';
import { Response } from '../response/types/response.entity';
import { EmailService } from '../util/email/email.service';
import { YouthRoles } from '../youth/types/youthRoles';
import { AWSS3Service } from '../aws/aws-s3.service';
import { Sentence } from '../sentence/types/sentence.entity';

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

const reviewer_UUID = '123e4567-e89b-12d3-a456-426614174000';
export const assignment_UUID = '123e4567-e89b-12d3-a456-426614174330';
const assignment_UUID2 = '123e4567-e89b-12d3-a456-426614174330';
const assignment_UUID3 = '79233fb0-9036-11ec-b909-0242ac120002';

const mockReviewer: Reviewer = {
  ...reviewerExamples[0],
  uuid: reviewer_UUID,
  id: 1,
};
const mockYouth: Youth = {
  ...youthExamples[0],
  role: YouthRoles.TREATMENT,
  id: 1,
};
const mockYouthControl: Youth = {
  ...youthExamples[0],
  role: YouthRoles.CONTROL,
  id: 1,
};

export const incompleteMockAssignment: Assignment = {
  uuid: assignment_UUID,
  reviewer: mockReviewer,
  youth: mockYouth,
  s3LetterLink: '',
  id: 1,
  survey: mockSurvey,
  status: AssignmentStatus.INCOMPLETE,
  responses: [],
  sent: false,
  reminderSent: false,
  started: new Date('2022-02-10'),
};

export const inProgressMockAssignment: Assignment = {
  uuid: assignment_UUID,
  reviewer: mockReviewer,
  youth: mockYouth,
  s3LetterLink: '',
  id: 1,
  survey: mockSurvey,
  status: AssignmentStatus.IN_PROGRESS,
  responses: [],
  sent: false,
  reminderSent: false,
  started: new Date('2022-02-10'),
};

export const incompleteMockAssignment2: Assignment = {
  uuid: assignment_UUID3,
  reviewer: mockReviewer,
  youth: mockYouth,
  id: 1,
  s3LetterLink: '',
  survey: mockSurvey,
  status: AssignmentStatus.INCOMPLETE,
  responses: [],
  sent: false,
  reminderSent: false,
  started: new Date('2022-02-10'),
};

export const mockAssignment: Assignment = {
  uuid: assignment_UUID,
  reviewer: mockReviewer,
  youth: mockYouth,
  s3LetterLink: new AWSS3Service().createLink(mockYouth.id, 1, 'jpal-letters'),
  id: 1,
  survey: mockSurvey,
  status: AssignmentStatus.COMPLETED,
  responses: [],
  sent: false,
  reminderSent: false,
  started: new Date('2022-02-10'),
};

export const mockAssignment2: Assignment = {
  uuid: assignment_UUID2,
  reviewer: mockReviewer,
  youth: mockYouth,
  s3LetterLink: '',
  id: 1,
  survey: mockSurvey,
  status: AssignmentStatus.COMPLETED,
  responses: [],
  sent: true,
  reminderSent: false,
  started: new Date('2022-02-10'),
};

export const mockAssignment3: Assignment = {
  uuid: assignment_UUID2,
  reviewer: mockReviewer,
  youth: mockYouthControl,
  s3LetterLink: '',
  id: 1,
  survey: mockSurvey,
  status: AssignmentStatus.COMPLETED,
  responses: [],
  sent: false,
  reminderSent: false,
  started: new Date('2022-02-10'),
};

export const mockResponses: SurveyResponseDto[] = [
  {
    question: DEFAULT_QUESTIONS[0].question,
    selectedOption: DEFAULT_QUESTIONS[0].options[0],
  },
  {
    question: DEFAULT_QUESTIONS[1].question,
    selectedOption: DEFAULT_QUESTIONS[0].options[0],
  },
];

const mockAssignmentRepository: Partial<Repository<Assignment>> = {
  save<T>(assignment: T): T {
    return assignment;
  },
  async findOne() {
    return incompleteMockAssignment;
  },
  find(options?: FindManyOptions<Assignment> | FindConditions<Assignment>): Promise<Assignment[]> {
    // this checks to see if a find call is trying to filter the results by completed and unsent
    if (options && 'where' in options) {
      if (Array.isArray(options.where)) {
        return Promise.resolve([incompleteMockAssignment2, inProgressMockAssignment]);
      }
      return Promise.resolve([mockAssignment]);
    }
    return Promise.resolve([
      mockAssignment,
      mockAssignment2,
      mockAssignment3,
      incompleteMockAssignment2,
      incompleteMockAssignment,
      inProgressMockAssignment,
    ]);
  },
};

const mockQuestionRepository = mock<Repository<Question>>();
const mockOptionRepository = mock<Repository<Option>>();
const mockResponseRepository = mock<Repository<Response>>();
const mockYouthRepository = mock<Repository<Youth>>();

mockOptionRepository.findOne.mockResolvedValue(exampleOptions[0]);
mockQuestionRepository.findOne.mockResolvedValue({
  id: 1,
  text: 'How often is this student responsible?',
  options: exampleOptions,
  sentence: new Sentence(),
});
mockResponseRepository.find.mockResolvedValue([]);

describe('AssignmentService', () => {
  let service: AssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: getRepositoryToken(Assignment),
          useValue: mockAssignmentRepository,
        },
        {
          provide: getRepositoryToken(Question),
          useValue: mockQuestionRepository,
        },
        {
          provide: getRepositoryToken(Option),
          useValue: mockOptionRepository,
        },
        {
          provide: getRepositoryToken(Response),
          useValue: mockResponseRepository,
        },
        {
          provide: getRepositoryToken(Youth),
          useValue: mockYouthRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: AWSS3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getByUUID', () => {
    it('should get an assignment by uuid with the default relations', async () => {
      jest.spyOn(mockAssignmentRepository, 'findOne').mockResolvedValueOnce(mockAssignment2);

      const assignment = await service.getByUuid(assignment_UUID2);

      expect(assignment).toEqual(mockAssignment2);
      expect(mockAssignmentRepository.findOne).toHaveBeenCalledWith({
        relations: ['responses', 'responses.question', 'responses.option', 'youth', 'reviewer'],
        where: { uuid: assignment_UUID2 },
      });
    });

    it('should get an assignment using the given relations', async () => {
      jest.spyOn(mockAssignmentRepository, 'findOne').mockResolvedValueOnce(mockAssignment2);

      const assignment = await service.getByUuid(assignment_UUID2, ['responses']);

      expect(assignment).toEqual(mockAssignment2);
      expect(mockAssignmentRepository.findOne).toHaveBeenCalledWith({
        relations: ['responses'],
        where: { uuid: assignment_UUID2 },
      });
    });
  });

  it('should complete an assignment', async () => {
    const assignmentUpload = jest
      .spyOn(mockAssignmentRepository, 'findOne')
      .mockResolvedValueOnce(incompleteMockAssignment);
    jest.spyOn(mockS3Service, 'upload');
    const assignment = await service.complete(mockAssignment.uuid, mockResponses);
    expect(assignment).toEqual(mockAssignment);
    expect(assignmentUpload).toHaveBeenCalledTimes(2);
  });

  it('should not start an assignment that is complete', () => {
    jest.spyOn(mockAssignmentRepository, 'findOne').mockResolvedValueOnce(mockAssignment);
    expect(service.start(mockAssignment.uuid)).rejects.toThrow();
  });

  it('should start an assignment', async () => {
    jest
      .spyOn(mockAssignmentRepository, 'findOne')
      .mockResolvedValueOnce(incompleteMockAssignment2);
    const assignment = await service.start(assignment_UUID3);
    expect(assignment.status).toEqual(AssignmentStatus.IN_PROGRESS);
  });

  it('should send complete, unsent surveys to treatment youth', async () => {
    const assignmentSave = jest.spyOn(mockAssignmentRepository, 'save');

    // MOCK awsS3Service.createLink to return a known link
    const mockedLink = 'https://jpal-letters.s3.us-east-2.amazonaws.com/1-1LOR.pdf';
    jest.spyOn(mockS3Service, 'createLink').mockReturnValue(mockedLink);

    await service.sendUnsentSurveysToYouth();

    expect(mockEmailService.queueEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailService.queueEmail).toHaveBeenNthCalledWith(
      1,
      mockAssignment.youth.email,
      service.youthEmailSubject(reviewerExamples[0].firstName, reviewerExamples[0].lastName),
      'Please find the letter of recommendation at the following link: ' + mockedLink,
    );

    expect(assignmentSave).toHaveBeenCalledTimes(1);
    expect(assignmentSave).toReturnWith({ ...mockAssignment, sent: true });
  });

  it('should send a reminder for incomplete or in progress surveys older than 1 week to reviewers', async () => {
    const assignmentSave = jest.spyOn(mockAssignmentRepository, 'save');
    await service.sendRemindersToReviewers();

    expect(mockEmailService.queueEmail).toHaveBeenCalledTimes(2);
    expect(mockEmailService.queueEmail).toHaveBeenNthCalledWith(
      1,
      mockAssignment.reviewer.email,
      service.reviewerEmailSubject(youthExamples[0].firstName, youthExamples[0].lastName),
      service.reviewerEmailHTML(youthExamples[0].firstName, youthExamples[0].lastName),
    );

    expect(assignmentSave).toHaveBeenCalledTimes(2);
    expect(incompleteMockAssignment2.reminderSent).toEqual(true);
    expect(inProgressMockAssignment.reminderSent).toEqual(true);
  });
});
