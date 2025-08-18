import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { Question } from './types/question.entity';
import { BadRequestException } from '@nestjs/common';
import {
  mockQuestion1,
  mockQuestion2,
  question1,
  question2,
  multiQuestion1,
  plainTextSentences,
  mockReturnedQuestion1,
  mockReturnedQuestion2,
  multiQuestionDTO,
} from './question.controller.spec';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockSurveyTemplateRepository } from '../survey/survey.service.spec';
import { Option } from '../option/types/option.entity';
import { Fragment } from '../fragment/types/fragment.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { DeleteResult, Repository } from 'typeorm';

const questionWithWrongOptions = {
  ...mockQuestion1,
  include_if_selected_options: ['wrong_option'],
  sentence_template: 'mock_sentence_template',
  options: mockQuestion1.options.map((option: any) => option.id?.toString?.() ?? option),
};

export const multiQuestionWrongOptions: multiQuestionDTO = {
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
  include_if_selected_option: ['yes', 'yes', 'maybe'],
};

const mockSaveImplementation = async (entityOrEntities: any) => {
  if (Array.isArray(entityOrEntities)) {
    return entityOrEntities;
  }
  return entityOrEntities;
};

const mockDeleteResult: DeleteResult = {
  raw: [],
  affected: 1,
};

const mockQuestionRepository = mock<Repository<Question>>();
mockQuestionRepository.find.mockResolvedValue([mockQuestion1, mockQuestion2]);
mockQuestionRepository.save.mockImplementation(mockSaveImplementation);
mockQuestionRepository.findOne.mockResolvedValue(mockQuestion1);
mockQuestionRepository.delete.mockResolvedValue(mockDeleteResult);

const mockSentenceRepository = mock<Repository<Sentence>>();
mockSentenceRepository.save.mockImplementation(mockSaveImplementation);

const mockOptionRepository = mock<Repository<Option>>();
mockOptionRepository.save.mockImplementation(mockSaveImplementation);

const mockFragmentRepository = mock<Repository<Fragment>>();
mockFragmentRepository.save.mockImplementation(mockSaveImplementation);

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
        {
          provide: getRepositoryToken(Option),
          useValue: mockOptionRepository,
        },
        {
          provide: getRepositoryToken(Fragment),
          useValue: mockFragmentRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Bulk upload questions method', () => {
    it('should return expected list of questions', async () => {
      const questionDataReturned = await service.getAllQuestions();
      expect(questionDataReturned[0]).toEqual(mockReturnedQuestion1);
      expect(questionDataReturned[1]).toEqual(mockReturnedQuestion2);
    });

    it('should return the number of created plain text entities created', async () => {
      const createReturned = await service.batchCreatePlainText(plainTextSentences);
      expect(createReturned).toBe(2);
    });

    it('should return the number of created question entities created', async () => {
      const createReturned = await service.batchCreateQuestions([question1, question2]);
      expect(createReturned).toBe(2);
    });

    it('should return the number of multi questions created question entities created', async () => {
      const createReturned = await service.batchCreateMultiQuestions([multiQuestion1]);
      expect(createReturned).toBe(1);
    });

    it('should throw an error if include_if_selected_options are not in options for single question', async () => {
      await expect(service.batchCreateQuestions([questionWithWrongOptions])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if include_if_selected_options are not in options for multi question', async () => {
      await expect(service.batchCreateMultiQuestions([multiQuestionWrongOptions])).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  it('should return a delete result', async () => {
    const deleteRes = await service.deleteQuestion(1);
    expect(deleteRes).toEqual(mockDeleteResult);
  });
});
