import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
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

const reviewer_UUID = '123e4567-e89b-12d3-a456-426614174000';
export const assignment_UUID = '123e4567-e89b-12d3-a456-426614174330';
const assignment_UUID2 = '123e4567-e89b-12d3-a456-426614174330';

const mockReviewer: Reviewer = {
  ...reviewerExamples[0],
  uuid: reviewer_UUID,
  id: 1,
};
const mockYouth: Youth = {
  ...youthExamples[0],
  id: 1,
};

export const incompleteMockAssignment: Assignment = {
  uuid: assignment_UUID,
  reviewer: mockReviewer,
  youth: mockYouth,
  id: 1,
  survey: mockSurvey,
  status: AssignmentStatus.INCOMPLETE,
  responses: [],
};

export const mockAssignment: Assignment = {
  uuid: assignment_UUID,
  reviewer: mockReviewer,
  youth: mockYouth,
  id: 1,
  survey: mockSurvey,
  status: AssignmentStatus.COMPLETED,
  responses: [],
};

export const mockAssignment2: Assignment = {
  uuid: assignment_UUID2,
  reviewer: mockReviewer,
  youth: mockYouth,
  id: 1,
  survey: mockSurvey,
  status: AssignmentStatus.COMPLETED,
  responses: [],
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
  save<T>(assignment): T {
    return assignment;
  },
  async findOne() {
    return incompleteMockAssignment;
  },
};

const mockQuestionRepository = mock<Repository<Question>>();
const mockOptionRepository = mock<Repository<Option>>();
const mockResponseRepository = mock<Repository<Response>>();

mockOptionRepository.findOne.mockResolvedValue(exampleOptions[0]);
mockQuestionRepository.findOne.mockResolvedValue({
  id: 1,
  text: 'How often is this student responsible?',
  surveyTemplate: mockSurveyTemplate,
  options: exampleOptions,
});

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
    const assignment = await service.complete(mockAssignment.uuid, mockResponses);
    expect(assignment).toEqual(mockAssignment);
  });
});
