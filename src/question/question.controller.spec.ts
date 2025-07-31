import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Sentence } from './../sentence/types/sentence.entity';
import { Question } from './types/question.entity';
import { exampleOptions } from './question.examples';
import { UploadQuestionsDTO } from './dto/upload-question.dto';



const plaintextsentences: string[] = [
  "Youth worked at Accelerate Academy",
  "Youth worked July - August of 2023"
]

const question1 = {
  text: string;
  options: string[];
  sentence_template: string;
  include_if_selected_options: string[];
}

const questionInfo: string[] = [
  "Youth worked at Accelerate Academy",
  "Youth worked July - August of 2023"
]
export const mockUploadQuestionDTO: UploadQuestionsDTO = {
  questions: ,
  multi_questions: ,
  plain_text: plaintextsentences,
};

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