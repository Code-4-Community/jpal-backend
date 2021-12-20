import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment } from './types/assignment.entity';
import { AssignmentService } from './assignment.service';
import {
  mockSurvey,
  mockSurveyRepository,
} from '../survey/survey.service.spec';
import { reviewerExamples } from '../reviewer/reviewer.examples';
import { youthExamples } from '../youth/youth.examples';
import { AssignmentStatus } from './types/assignmentStatus';
import { Survey } from '../survey/types/survey.entity';
import { Reviewer } from '../reviewer/types/reviewer.entity';
import { Youth } from '../youth/types/youth.entity';

const reviewer_UUID = '123e4567-e89b-12d3-a456-426614174000';
export const assignment_UUID = '123e4567-e89b-12d3-a456-426614174330';

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

const mockAssignmentRepository: Partial<Repository<Assignment>> = {
  save<T>(assignment): T {
    return assignment;
  },
  async findOne() {
    return incompleteMockAssignment;
  },
};

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
          provide: getRepositoryToken(Survey),
          useValue: mockSurveyRepository,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should complete an assignment', async () => {
    const assignment = await service.complete(mockAssignment.uuid);
    expect(assignment).toEqual(mockAssignment);
  });
});
