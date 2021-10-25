import { Test, TestingModule } from '@nestjs/testing';
import { SurveyTemplateService } from './surveyTemplate.service';
import { DeepPartial, Repository } from "typeorm";
import { User } from "../user/types/user.entity";
import { SurveyTemplate } from "./types/surveyTemplate.entity";
import { Role } from "../user/types/role";
import { BadRequestException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  role: Role.ADMIN,
};
const mockSurveyTemplate: SurveyTemplate = { id: 1, creator: mockUser, questions: []}

const mockSurveyTemplateRepository: Partial<Repository<SurveyTemplate>> = {
  findOne(query: any): any {
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
    await expect(
      service.getById(-1),
    ).rejects.toThrow(new BadRequestException(`Survey template id ${-1} not found`));
  });

  it('should return expected survey template if id in table', async () => {
    const surveyTemplate = await service.getById(1);
    expect(surveyTemplate).toEqual({
      id: 1,
      creator: mockUser,
      questions: []
    });
  });
});
