import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionData, QuestionService } from './question.service';
import { Option } from './../option/types/option.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  Repository,
} from 'typeorm';
import { SurveyTemplate } from './../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from './../sentence/types/sentence.entity';
import { User } from './../user/types/user.entity';
import { Role } from './../user/types/role';
import { Question } from './types/question.entity';
import {
  mockQuestion1,
  mockQuestion2,
  mockReturnedQuestion1,
  mockReturnedQuestion2,
} from './question.controller.spec';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockSurveyTemplateRepository } from './../survey/survey.service.spec';

const mockQuestionRepository = mock<Repository<Question>>();
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
});
