import { Test, TestingModule } from '@nestjs/testing';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment } from './types/assignment.entity';
import { AssignmentService } from './assignment.service';
import { mockSurvey, mockSurveyTemplate } from '../survey/survey.controller.spec';
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

const mockEmailService: Partial<EmailService> = {
  queueEmail: jest.fn(),
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
  s3LetterLink: "",
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
  s3LetterLink: "",
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
  s3LetterLink: "",
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
  s3LetterLink: "",
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
  s3LetterLink: "",
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
  s3LetterLink: "",
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
  surveyTemplate: mockSurveyTemplate,
  options: exampleOptions,
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
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get an assignment by uuid', async () => {
    jest.spyOn(mockAssignmentRepository, 'findOne').mockResolvedValueOnce(mockAssignment2);
    const assignment = await service.getByUuid(assignment_UUID2);
    expect(assignment).toEqual(mockAssignment2);
  });

  it('should complete an assignment', async () => {
    jest.spyOn(mockAssignmentRepository, 'findOne').mockResolvedValueOnce(incompleteMockAssignment);
    const assignment = await service.complete(mockAssignment.uuid, mockResponses);
    expect(assignment).toEqual(mockAssignment);
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
    await service.sendUnsentSurveysToYouth();

    expect(mockEmailService.queueEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailService.queueEmail).toHaveBeenNthCalledWith(
      1,
      mockAssignment.youth.email,
      service.youthEmailSubject(reviewerExamples[0].firstName, reviewerExamples[0].lastName),
      service.youthEmailBodyHTML(),
      [expect.objectContaining({ filename: 'letter.pdf', content: expect.anything() })],
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
