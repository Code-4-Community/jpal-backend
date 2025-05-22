import { Test, TestingModule } from '@nestjs/testing';
import { SurveyTemplateService } from './surveyTemplate.service';
import { Repository } from 'typeorm';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockUser } from '../user/user.service.spec';
import { Question } from '../question/types/question.entity';

const mockSurveyTemplate: SurveyTemplate = {
  id: 1,
  creator: mockUser,
  questions: [
    {
      id: 101,
      text: 'What is your favorite color?',
      surveyTemplate: {} as SurveyTemplate, // circular ref, safe to stub for test
      options: [
        {
          id: 201,
          text: 'Red',
          question: {} as Question,
        },
        {
          id: 202,
          text: 'Blue',
          question: {} as Question,
        },
      ],
    },
  ],
};

const mockSurveyTemplateRepository: Partial<Repository<SurveyTemplate>> = {
  async findOne(query: any): Promise<SurveyTemplate | undefined> {
    if (query.where.id === 1) return mockSurveyTemplate;
    return undefined;
  },
};

describe('SurveyTemplateService', () => {
  let service: SurveyTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyTemplateService,
        {
          provide: getRepositoryToken(SurveyTemplate),
          useValue: mockSurveyTemplateRepository,
        },
      ],
    }).compile();

    service = module.get<SurveyTemplateService>(SurveyTemplateService);
  });

  it('should error if the requested id is not in the table', async () => {
    expect(async () => {
      await service.getById(-1);
    }).rejects.toThrow();
  });

  it('should return expected survey template if id in table', async () => {
    const surveyTemplate = await service.getById(1);
    expect(surveyTemplate).toEqual([
      {
        question: 'What is your favorite color?',
        options: ['Red', 'Blue'],
      },
    ]);
  });
});
