import { Test, TestingModule } from '@nestjs/testing';
import { Question } from 'src/question/types/question.entity';
import { Reviewer } from 'src/reviewer/types/reviewer.entity';
import { SurveyTemplate } from 'src/surveyTemplate/types/surveyTemplate.entity';
import { Role } from 'src/user/types/role';
import { User } from 'src/user/types/user.entity';
import { Youth } from 'src/youth/types/youth.entity';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { Assignment } from './types/assignment.entity';
import { Option } from 'src/option/types/option.entity';
import { Response } from 'src/response/types/response.entity';

// const mockOption: Option;

// mockOption: Option = {
//   id: 15433,
//   question: mockQuestionOne,
//   text: 'blue',
// };

// const mockUser: User = {
//   id: 1,
//   email: 'test@test.com',
//   role: Role.ADMIN,
// };

// const mockResponse: Response = {
//   id: 1544,
//   question: mockQuestionOne,
//   option: mockOption,
//   assignment: mockAssignment,
// };

// const listMockResponses: Response[] = [mockResponse];

// const mockSurveyTemplate: SurveyTemplate = {
//   id: 154,
//   creator: mockUser,
//   questions: listMockQuestions,
// };

// const mockReviewer: Reviewer = {
//   id: 355311,
//   email: 'reviewer@northeastern.edu',
//   firstName: 'Daniel',
//   lastName: 'Kim',
// };

// const mockYouth: Youth = {
//   id: 532,
//   email: 'aketchum@pokemongo.com',
//   firstName: 'Ash',
//   lastName: 'Ketchum',
// };

// const mockQuestionOne: Question = {
//   id: 553,
//   surveyTemplate: mockSurveyTemplate,
//   text: 'what is your favorite color?',
// };

// const mockQuestionTwo: Question = {
//   id: 343,
//   surveyTemplate: mockSurveyTemplate,
//   text: 'do you like mexican food?',
// };

// const listMockQuestions: Question[] = [mockQuestionOne, mockQuestionTwo];

// const mockAssignment: Assignment = {
//   id: 541,
//   surveyTemplate: mockSurveyTemplate,
//   reviewer: mockReviewer,
//   youth: mockYouth,
//   completed: false,
//   creator: mockUser,
//   name: 'assignment one',
//   responses: [],

// };

const listMockAssignments: Assignment[] = [];

const serviceMock: Partial<AssignmentService> = {
    getAllAssignments: jest.fn(() => Promise.resolve(listMockAssignments)),
  };

describe('AssignmentController', () => {
  let controller: AssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentController],
      providers: [
        {
          provide: AssignmentService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
  });

  it('should find all the assignments created by the user', async () => {
      expect.assertions(2);
      expect(await controller.getAllAssignments()).toEqual(listMockAssignments);
      expect(serviceMock.getAllAssignments).toHaveBeenCalled();
  });
});
