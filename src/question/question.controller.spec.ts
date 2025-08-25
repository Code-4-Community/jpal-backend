import { Test, TestingModule } from '@nestjs/testing';
import {
  FIVE_SENTIMENT_OPTIONS,
  NEVER,
  RARELY,
  OFTEN,
  ALWAYS,
  exampleOptions,
} from './question.examples';
import { UploadQuestionsDTO, UploadQuestionResponseDTO } from './dto/upload-question.dto';
import { QuestionController } from './question.controller';
import { Question } from './types/question.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { QuestionService, QuestionTextData } from './question.service';
import { QuestionData } from './question.service';
import { mockSurveyTemplate } from './../survey/survey.controller.spec';
import { DeleteResult } from 'typeorm';
import { EditDto } from '../util/dto/edit.dto';

export const mockOptionsData: string[] = exampleOptions.map((o) => o.text);

export const mockQuestion1: Question = {
  id: 1,
  text: 'How often is this student responsible?',
  options: exampleOptions,
  sentence: new Sentence(),
};

export const mockQuestion2: Question = {
  id: 2,
  text: 'How often did this student arrive on time for work?',
  options: exampleOptions,
  sentence: new Sentence(),
};

export const mockQuestion1Return: QuestionTextData = {
  id: 1,
  text: 'How often is this student not responsible?',
};

export const mockQuestion1Dto: EditDto = {
  id: 1,
  text: 'How often is this student not responsible?',
};

export const mockReturnedQuestion1: QuestionData = {
  id: mockQuestion1.id,
  text: mockQuestion1.text,
  template: mockQuestion1.sentence.template,
  options: mockOptionsData,
};

class questionDTO {
  text: string;
  options: string[];
  sentence_template: string;
  include_if_selected_options: string[];
}

export const question1: questionDTO = {
  text: 'responsible',
  options: FIVE_SENTIMENT_OPTIONS,
  sentence_template: 'Youth was _____',
  include_if_selected_options: [OFTEN, ALWAYS],
};

export const question2: questionDTO = {
  text: 'timely',
  options: FIVE_SENTIMENT_OPTIONS,
  sentence_template: 'Youth was ____',
  include_if_selected_options: [NEVER, RARELY],
};

const questionInfo: questionDTO[] = [question1, question2];

export class multiQuestionDTO {
  sentence_template: string;
  fragment_texts: string[];
  question_texts: string[];
  options: string[][];
  include_if_selected_option: string[];
}

export const multiQuestion1: multiQuestionDTO = {
  sentence_template: 'Youth was a ___, ___, and ___ employee',
  fragment_texts: ['responsible', 'timely', 'hard-working'],
  question_texts: [
    'was youth a responsible employee?',
    'was youth a timely employee?',
    'was youth a hard-working employee?',
  ],
  options: [
    ['yes', 'no'],
    ['yes', 'no'],
    ['yes', 'no'],
  ],
  include_if_selected_option: ['yes', 'yes', 'yes'],
};

const multiQuestionInfo: multiQuestionDTO[] = [multiQuestion1];

export const plainTextSentences: string[] = [
  'Youth worked at Accelerate Academy',
  'Youth worked July - August of 2023',
];

export const mockUploadQuestionDTO: UploadQuestionsDTO = {
  questions: questionInfo,
  multi_questions: multiQuestionInfo,
  plain_text: plainTextSentences,
};

export const mockUploadQuestionResponseDTO: UploadQuestionResponseDTO = {
  questions: 2,
  multi_question_sentences: 3,
  plain_text_sentences: 2,
};

export const mockReturnedQuestion2: QuestionData = {
  id: mockQuestion2.id,
  text: mockQuestion2.text,
  template: mockQuestion2.sentence.template,
  options: mockOptionsData,
};

const mockDeleteResult: DeleteResult = {
  raw: [],
  affected: 1,
};

export const mockQuestionService: Partial<QuestionService> = {
  getAllQuestions: jest.fn(() => Promise.resolve([mockReturnedQuestion1, mockReturnedQuestion2])),
  updateQuestionText: jest.fn(() => Promise.resolve(mockQuestion1Return)),
  batchCreatePlainText: jest.fn(() => Promise.resolve(2)),
  batchCreateQuestions: jest.fn(() => Promise.resolve(2)),
  batchCreateMultiQuestions: jest.fn(() => Promise.resolve(3)),
  deleteQuestion: jest.fn(() => Promise.resolve(mockDeleteResult)),
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

  describe('edit question text', () => {
    it('should edit the question text', async () => {
      await expect(
        controller.editQuestionText(mockQuestion1Dto),
      ).resolves.toEqual(mockQuestion1Return);
      expect(mockQuestionService.updateQuestionText).toHaveBeenCalled();
    });
  });

  describe('create questions', () => {
    it('should return number of sentences and questions made', async () => {
      expect(await controller.create(mockUploadQuestionDTO)).toEqual(mockUploadQuestionResponseDTO);
      expect(mockQuestionService.batchCreateMultiQuestions).toHaveBeenCalled();
      expect(mockQuestionService.batchCreatePlainText).toHaveBeenCalled();
      expect(mockQuestionService.batchCreateQuestions).toHaveBeenCalled();
    });
    it('should delegate deleting questions to the question service', async () => {
      expect.assertions(1);
      expect(await controller.deleteQuestion(1)).toEqual(mockDeleteResult);
    });
  });
});
