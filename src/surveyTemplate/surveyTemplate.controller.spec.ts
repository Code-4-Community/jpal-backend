import { Test, TestingModule } from '@nestjs/testing';
import { SurveyTemplateController } from './surveyTemplate.controller';
import {
  SurveyNameData,
  SurveyTemplateData,
  SurveyTemplateService,
} from './surveyTemplate.service';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { mockUser } from '../user/user.service.spec';
import { Question } from '../question/types/question.entity';
import { DeleteResult } from 'typeorm';
import exp from 'node:constants';

const mockSurveyTemplate: SurveyTemplate = {
  id: 1,
  creator: mockUser,
  name: 'name',
  questions: [],
};

const mockSurveyNameData: SurveyNameData = {
  id: 1,
  name: 'survey',
};

const mockSurveyTemplateData: SurveyTemplateData = { name: 'name', questions: [] };

const serviceMock: Partial<SurveyTemplateService> = {
  getByCreator: jest.fn(() => Promise.resolve([mockSurveyNameData])),
  getById: jest.fn(() => Promise.resolve(mockSurveyTemplateData)),
  updateSurveyTemplate: jest.fn(() => Promise.resolve(mockSurveyTemplateData)),
  deleteSurveyTemplate: jest.fn(() => Promise.resolve(mockDeleteResult)),
  updateSurveyTemplateName: jest.fn(() => Promise.resolve(mockSurveyTemplateData)),
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

describe('SurveyTemplateController', () => {
  let controller: SurveyTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyTemplateController],
      providers: [
        {
          provide: SurveyTemplateService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<SurveyTemplateController>(SurveyTemplateController);
  });

  it('should delegate fetching survey templates to the survey template service', async () => {
    expect.assertions(2);
    expect(await controller.getById(1)).toEqual(mockSurveyTemplateData);
    expect(serviceMock.getById).toHaveBeenCalledWith(mockSurveyTemplate.id);
  });

  it('should delegate updating survey templates to the survey template service', async () => {
    expect.assertions(1);
    expect(await controller.editSurveyTemplate(1, questions)).toEqual(mockSurveyTemplateData);
  });

  it('should delegate deleting survey templates to the survey template service', async () => {
    expect.assertions(1);
    expect(await controller.deleteSurveyTemplate(1)).toEqual(mockDeleteResult);
  });

  it('should delegate updating a survey template name to the survey template service', async () => {
    expect.assertions(1);
    expect(await controller.editSurveyTemplateName(1, 'new name')).toEqual(mockSurveyTemplateData);
  });

  it('should delegate fetching survey templates by creator to the survey template service', async () => {
    expect.assertions(2);
    expect(await controller.getByCreator(mockUser)).toEqual([mockSurveyNameData]);
    expect(serviceMock.getByCreator).toHaveBeenCalledWith(mockUser);
  });
});
