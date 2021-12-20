import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment } from './types/assignment.entity';
import { AssignmentService } from './assignment.service';
import { Youth } from '../youth/types/youth.entity';
import { Reviewer } from '../reviewer/types/reviewer.entity';
import { mockSurvey } from 'src/survey/survey.service.spec';

const UUID = '123e4567-e89b-12d3-a456-426614174000';

const exampleReviwer: Reviewer = {
  firstName: 'Olivia',
  lastName: 'Blier',
  email: 'blierolivia@gmail.com',
  id: 1,
};

const exampleYouth: Youth = {
  firstName: 'Ryan',
  lastName: 'Jung',
  email: 'jung.ry@northeastern.edu',
  id: 1,
};

export const mockAssignment: Assignment = {
  uuid: UUID,
  reviewer: exampleReviwer,
  youth: exampleYouth,
  id: 1,
  survey: mockSurvey,
  completed: false,
  responses: [],
};

const mockAssignmentRepository: Partial<Repository<Assignment>> = {
  save<T>(survey): T {
    return survey;
  },
  findOne(): any {
    return undefined;
  },
};

describe('AssignmentService', () => {
  let service: AssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: getRepositoryToken(AssignmentService),
          useValue: mockAssignmentRepository,
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
