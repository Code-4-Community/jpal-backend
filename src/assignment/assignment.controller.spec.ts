import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { mock } from 'jest-mock-extended';
import { mockSurveyService } from '../survey/survey.controller.spec';
import { SurveyService } from '../survey/survey.service';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { assignment_UUID, mockAssignment, mockResponses } from './assignment.service.spec';

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
});
