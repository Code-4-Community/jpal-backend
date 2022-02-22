import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { mock } from 'jest-mock-extended';
import { mockSurveyService } from '../survey/survey.controller.spec';
import { SurveyService } from '../survey/survey.service';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { AssignmentStatus } from './types/assignmentStatus';
import {
  assignment_UUID,
  mockAssignment,
  mockResponses,
  inProgressMockAssignment,
} from './assignment.service.spec';

const mockAssignmentService = mock<AssignmentService>();

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

  it('should fail to complete an assignment when given a bad ID', async () => {
    expect.assertions(1);
    mockAssignmentService.getByUuid.mockResolvedValue(undefined);
    expect(controller.complete('bad!', mockCompleteAssignmentDto)).rejects.toThrow();
  });

  it('should complete an assignment', async () => {
    expect.assertions(1);
    mockAssignmentService.getByUuid.mockResolvedValue(mockAssignment);
    mockAssignmentService.complete.mockResolvedValue(mockAssignment);
    const assignment = await controller.complete(assignment_UUID, mockCompleteAssignmentDto);
    expect(assignment).toEqual(mockAssignment);
  });

  it('should mark an assignment as in progress', async () => {
    const assignment = () => controller.start('bad!');
    expect(assignment).rejects.toThrow();
  });

  it('should mark an assignment as in progress', async () => {
    mockAssignmentService.start.mockResolvedValue(inProgressMockAssignment);
    const assignment = await controller.start(assignment_UUID);
    expect(assignment.status).toEqual(AssignmentStatus.IN_PROGRESS);
  });
});
