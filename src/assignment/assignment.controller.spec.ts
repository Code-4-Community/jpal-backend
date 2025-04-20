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
import { Assignment } from './types/assignment.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Role } from '../user//types/role';

const mockAssignmentService = mock<AssignmentService>();

const mockCompleteAssignmentDto = {
  responses: mockResponses,
};

const mockAssignmentResponses = {
  uuid: '123-456',
  survey: {
    creator: {
      id: 1,
    },
  },
  responses: [],
} as Assignment;

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

  describe('GET :uuid/responses', () => {
    it('should return assignment responses for the given assignment', async () => {
      expect.assertions(1);

      mockAssignmentService.getByUuid.mockResolvedValue(mockAssignmentResponses);
      const assignment = await controller.viewResponse('123-456', { id: 1 });

      expect(assignment).toEqual(mockAssignmentResponses);
    });

    it('should return assignment if requester is not the creator but is a researcher', async () => {
      expect.assertions(1);

      mockAssignmentService.getByUuid.mockResolvedValue(mockAssignmentResponses);
      const assignment = await controller.viewResponse('123-456', { id: 2, role: Role.RESEARCHER });

      expect(assignment).toEqual(mockAssignmentResponses);
    })

    it('should throw bad request exception when no assignment is found', async () => {
      expect.assertions(1);

      mockAssignmentService.getByUuid.mockResolvedValue(undefined);
      
      await expect(controller.viewResponse('xxx-xxx', { id: 1 })).rejects.toThrow(BadRequestException);
    });

    it('should return unauthorized exception if assignment creator is not the requester and requeseter is admin', async () => {
      expect.assertions(1);

      mockAssignmentService.getByUuid.mockResolvedValue(mockAssignmentResponses);

      await expect(controller.viewResponse('xxx-xxx', { id: 2, role: Role.ADMIN })).rejects.toThrow(UnauthorizedException);
    });
  })
});
