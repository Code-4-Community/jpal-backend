import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { mockSurveyService } from '../survey/survey.controller.spec';
import { SurveyService } from '../survey/survey.service';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import {
  assignment_UUID,
  inProgressMockAssignment,
  mockAssignment,
  mockResponses,
} from './assignment.service.spec';
import { AssignmentStatus } from './types/assignmentStatus';

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
    await expect(controller.complete('bad!', mockCompleteAssignmentDto)).rejects.toThrow();
  });

  it('should complete an assignment', async () => {
    expect.assertions(1);
    mockAssignmentService.getByUuid.mockResolvedValue(mockAssignment);
    mockAssignmentService.complete.mockResolvedValue(mockAssignment);
    const assignment = await controller.complete(assignment_UUID, mockCompleteAssignmentDto);
    expect(assignment).toEqual(mockAssignment);
  });

  it('should fail to start an assignment that does not exist', async () => {
    expect.assertions(1);
    mockAssignmentService.getByUuid.mockResolvedValue(undefined);
    await expect(controller.start('bad!')).rejects.toThrow();
  });

  it('should mark an assignment as in progress', async () => {
    expect.assertions(1);
    mockAssignmentService.getByUuid.mockResolvedValue(mockAssignment);
    mockAssignmentService.start.mockResolvedValue(inProgressMockAssignment);
    const assignment = await controller.start(assignment_UUID);
    expect(assignment.status).toEqual(AssignmentStatus.IN_PROGRESS);
  });
});
