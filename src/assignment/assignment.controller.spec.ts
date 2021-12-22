import { Test, TestingModule } from '@nestjs/testing';
import { mockSurveyService } from '../survey/survey.controller.spec';
import { SurveyService } from '../survey/survey.service';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import {
  assignment_UUID,
  mockAssignment,
  mockAssignment2,
  mockResponses,
} from './assignment.service.spec';
import { Assignment } from './types/assignment.entity';

const mockAssignmentService: Partial<AssignmentService> = {
  async complete(): Promise<Assignment> {
    return mockAssignment;
  },
  async getByUuid(): Promise<Assignment> {
    return mockAssignment2;
  },
};

const mockCompleteAssignmentDto = {
  responses: mockResponses,
};

describe('AssignmentController', () => {
  let controller: AssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentController],
      providers: [
        {
          provide: AssignmentService,
          useValue: mockAssignmentService,
        },
        {
          provide: SurveyService,
          useValue: mockSurveyService,
        },
      ],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should complete an assignment', async () => {
    const assignment = () =>
      controller.complete('bad!', mockCompleteAssignmentDto);
    expect(assignment).rejects.toThrow();
  });

  it('should complete an assignment', async () => {
    const assignment = await controller.complete(
      assignment_UUID,
      mockCompleteAssignmentDto,
    );
    expect(assignment).toEqual(mockAssignment);
  });
});
