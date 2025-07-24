import { Test, TestingModule } from '@nestjs/testing';
import { SurveyTemplateService } from './surveyTemplate.service';
import { DeleteResult, Repository } from 'typeorm';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockUser } from '../user/user.service.spec';
import { Question } from '../question/types/question.entity';
import { transformQuestionToSurveyDataQuestion } from '../util/transformQuestionToSurveryDataQuestion';
import { BadRequestException } from '@nestjs/common';

const mockSurveyTemplate: SurveyTemplate = {
  id: 1,
  creator: mockUser,
  name: 'name',
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
    if (query.where.name === 'name') return mockSurveyTemplate;
    return undefined;
  },
  save: jest.fn().mockImplementation(async (template) => template),
  delete: jest.fn().mockImplementation(async (id: number) => mockDeleteResult),
};

const mockDeleteResult: DeleteResult = {
  raw: [],
  affected: 1,
};

const questions = [
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
];

const questions2 = [
  {
    id: 101,
    text: 'What is your favorite food?',
    surveyTemplate: {} as SurveyTemplate, // circular ref, safe to stub for test
    options: [
      {
        id: 201,
        text: 'Pizza',
        question: {} as Question,
      },
      {
        id: 202,
        text: 'Pasta',
        question: {} as Question,
      },
    ],
  },
];

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
    expect(surveyTemplate.questions[0].question).toEqual('What is your favorite color?');
    expect(surveyTemplate.questions[0].options.map((o) => o)).toEqual(['Red', 'Blue']);
  });

  it('should return an updated survey template', async () => {
    const surveyTemplate = await service.updateSurveyTemplate(1, questions);
    expect(surveyTemplate).toEqual({
      name: 'name',
      questions: transformQuestionToSurveyDataQuestion(questions),
    });
  });

  it('should error if the requested id is not in the table', async () => {
    expect(async () => {
      await service.updateSurveyTemplate(-1, questions);
    }).rejects.toThrow();
  });

  it('should return a delete result', async () => {
    const deleteRes = await service.deleteSurveyTemplate(1);
    expect(deleteRes).toEqual(mockDeleteResult);
  });

  it('should error if the requested id is not in the table', async () => {
    await expect(async () => {
      await service.updateSurveyTemplate(-1, questions);
    }).rejects.toThrow();
  });

  it('should return an updated survey template', async () => {
    const surveyTemplate = await service.updateSurveyTemplate(1, questions2);
    expect(surveyTemplate).toEqual({
      name: 'name',
      questions: transformQuestionToSurveyDataQuestion(questions2),
    });
  });

  it('should error if the requested id is not in the table', async () => {
    expect(async () => {
      await service.updateSurveyTemplate(-1, questions);
    }).rejects.toThrow();
  });

  it('should return a delete result', async () => {
    const deleteRes = await service.deleteSurveyTemplate(1);
    expect(deleteRes).toEqual(mockDeleteResult);
  });

  it('should error if the requested id is not in the table', async () => {
    expect(async () => {
      await service.updateSurveyTemplate(-1, questions);
    }).rejects.toThrow();
  });

  it('should update the name of the survey template', async () => {
    const updated = await service.updateSurveyTemplateName(1, 'new name');
    expect(updated).toEqual({
      name: 'new name',
      questions: transformQuestionToSurveyDataQuestion(questions2),
    });
  });

  it('should return a create result', async () => {
    expect(async () => {
      const newSurvey = await service.createSurveyTemplate(mockUser, "new name", []);
      expect(newSurvey).toEqual({
        creator: mockUser,
        name: "new name",
        questions: [],
      });
    });
  });

  it('should error if the template name already exists in database', async () => {
  await expect(
    service.createSurveyTemplate(mockUser, 'name', questions)
  ).rejects.toThrow(BadRequestException);
  });
})
