import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionData, QuestionService } from './question.service';
import { Sentence } from './../sentence/types/sentence.entity';
import { Question } from './types/question.entity';
import { exampleOptions } from './question.examples';
import { mockSurveyTemplate } from './../survey/survey.controller.spec';
import { DeleteResult } from 'typeorm';

export const mockOptionsData: string[] = exampleOptions.map((o) => o.text);

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
  options: mockOptionsData,
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
  options: mockOptionsData,
};

export const mockQuestionService: Partial<QuestionService> = {
  getAllQuestions: jest.fn(() => Promise.resolve([mockReturnedQuestion1, mockReturnedQuestion2])),
  deleteQuestion: jest.fn(() => Promise.resolve(mockDeleteResult)),
};

const mockDeleteResult: DeleteResult = {
  raw: [],
  affected: 1,
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

  it('should delegate deleting questions to the question service', async () => {
    expect.assertions(1);
    expect(await controller.deleteQuestion(1)).toEqual(mockDeleteResult);
  });
});
