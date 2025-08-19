import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { Repository } from 'typeorm';
import { SurveyTemplate } from './../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from './../sentence/types/sentence.entity';
import { Question } from './types/question.entity';
import {
  mockQuestion1,
  mockQuestion2,
  mockReturnedQuestion1,
  mockReturnedQuestion2,
  mockQuestion1Return,
} from './question.controller.spec';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockSurveyTemplateRepository } from './../survey/survey.service.spec';

const mockQuestionRepository = mock<Repository<Question>>();
mockQuestionRepository.findOne.mockImplementation(async (query: any) => {
  if (query?.where?.id === 1) return mockQuestion1;
  return undefined;
});
mockQuestionRepository.find.mockResolvedValue([mockQuestion1, mockQuestion2]);

const mockSentenceRepository = mock<Repository<Sentence>>();

describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(Question),
          useValue: mockQuestionRepository,
        },
        {
          provide: getRepositoryToken(SurveyTemplate),
          useValue: mockSurveyTemplateRepository,
        },
        {
          provide: getRepositoryToken(Sentence),
          useValue: mockSentenceRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return expected list of questions', async () => {
    const questionDataReturned = await service.getAllQuestions();
    expect(questionDataReturned[0]).toEqual(mockReturnedQuestion1);
    expect(questionDataReturned[1]).toEqual(mockReturnedQuestion2);
  });

  it('should error if the requested id is not in the table', async () => {
    expect(async () => {
      await service.getById(-1);
    }).rejects.toThrow();
  });

  it('should return expected question', async () => {
    const question = await service.getById(1);
    expect(question.text).toEqual('How often is this student responsible?');
  });

  it('should error if trying to edit an id not in the table', async () => {
    expect(async () => {
      await service.updateQuestionText(-1, 'How often is this student not responsible?');
    }).rejects.toThrow();
  });

  it('should properly edit the question', async () => {
    expect(async () => {
      expect(
        await service.updateQuestionText(1, 'How often is this student not responsible?'),
      ).toEqual(mockQuestion1Return);
    });
  });
});
