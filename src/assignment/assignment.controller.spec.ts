import { Test, TestingModule } from '@nestjs/testing';
import { mockUser } from '../user/user.service.spec';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';

const UUID = '123e4567-e89b-12d3-a456-426614174000';
const mockAssignmentService: Partial<AssignmentService> = {
  async complete(assignmentUuid: string): Promise<void>;,
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
      ],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should complete an assignment', async () => {
    const survey = await controller.complete(
      {
        uuid: UUID,
        surveyTemplateId: 1,
      },
    );
    expect(survey).toEqual(mockSurvey);
  });
});
