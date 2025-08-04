import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { Repository } from 'typeorm';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { Question } from './types/question.entity';
import {
  mockQuestion1,
  mockQuestion2,
  question1,
  question2,
  multiQuestion1,
  plainTextSentences,
  mockUploadQuestionDTO,
  mockReturnedQuestion1,
  mockReturnedQuestion2,
} from './question.controller.spec';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockSurveyTemplateRepository } from './../survey/survey.service.spec';
import { Option } from '../option/types/option.entity';
import { Fragment } from '../fragment/types/fragment.entity';

const mockQuestionRepository = mock<Repository<Question>>();
mockQuestionRepository.find.mockResolvedValue([mockQuestion1, mockQuestion2]);
mockQuestionRepository.save.mockImplementation(async (question: Question) => question);

const mockSentenceRepository = mock<Repository<Sentence>>();
const mockOptionRepository = mock<Repository<Option>>();
const mockFragmentRepository = mock<Repository<Fragment>>();


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
  it('should return expected list of questions', async () => {
    const questionDataReturned = await service.getAllQuestions();
    expect(questionDataReturned[0]).toEqual(mockReturnedQuestion1);
    expect(questionDataReturned[1]).toEqual(mockReturnedQuestion2);
  });
});
})