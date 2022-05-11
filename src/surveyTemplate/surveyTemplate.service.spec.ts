import { Test, TestingModule } from '@nestjs/testing';
import { SurveyTemplateService } from './surveyTemplate.service';
import { Repository } from 'typeorm';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockUser } from '../user/user.service.spec';

const mockSurveyTemplate: SurveyTemplate = { id: 1, creator: mockUser, questions: [] };

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
    expect(surveyTemplate).toEqual({
      id: 1,
      creator: mockUser,
      questions: [],
    });
  });
});
