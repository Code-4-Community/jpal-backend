import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionData, QuestionService } from './question.service';
import { Option } from './../option/types/option.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { SurveyTemplate } from './../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from './../sentence/types/sentence.entity';
import { User } from './../user/types/user.entity';
import { Role } from './../user/types/role';
import { Question } from './types/question.entity';

export const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  firstName: 'William',
  lastName: 'user',
  role: Role.ADMIN,
  createdDate: new Date('2023-09-24'),
};

export const mockSurveyTemplate: SurveyTemplate = {
  id: 1,
  creator: mockUser,
  name: 'name',
  questions: [],
};

export const exampleOptions: Option[] = [
  {
    id: 1,
    text: 'Never',
    question: undefined,
  },
  {
    id: 2,
    text: 'Rarely',
    question: undefined,
  },
  {
    id: 3,
    text: 'Somewhat',
    question: undefined,
  },
  {
    id: 4,
    text: 'Often',
    question: undefined,
  },
  {
    id: 5,
    text: 'Always',
    question: undefined,
  },
];

export const mockQuestion1: Question = {
  id: 1,
  text: 'How often is this student responsible?',
  surveyTemplate: mockSurveyTemplate,
  options: exampleOptions,
  sentence: new Sentence(),
};

export const mockReturnedQuestion1: QuestionData = {
  id: mockQuestion1.id,
  text: mockQuestion1.text,
  template: mockQuestion1.sentence.template,
  options: mockQuestion1.options,
};

export const mockQuestion2: Question = {
  id: 2,
  text: 'How often did this student arrive on time for work?',
  surveyTemplate: mockSurveyTemplate,
  options: exampleOptions,
  sentence: new Sentence(),
};

export const mockReturnedQuestion2: QuestionData = {
  id: mockQuestion2.id,
  text: mockQuestion2.text,
  template: mockQuestion2.sentence.template,
  options: mockQuestion2.options,
};

export const mockQuestionService: Partial<QuestionService> = {
  getAllQuestions: jest.fn(() => Promise.resolve([mockReturnedQuestion1, mockReturnedQuestion2])),
};

describe('QuestionController', () => {
  let controller: QuestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSurveyAssignments', () => {
    it('should return questions', async () => {
      expect(await controller.getAllQuestions()).toEqual([
        mockReturnedQuestion1,
        mockReturnedQuestion2,
      ]);
      expect(mockQuestionService.getAllQuestions).toHaveBeenCalled();
    });
  });
});
