import { Test, TestingModule } from '@nestjs/testing';
import { SurveyTemplateController } from './surveyTemplate.controller';
import { SurveyDataQuestion, SurveyTemplateService } from './surveyTemplate.service';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { mockUser } from '../user/user.service.spec';

const mockSurveyTemplate: SurveyTemplate = { id: 1, creator: mockUser, questions: [] };

const serviceMock = {
  getById: jest.fn().mockResolvedValue([
    {
      question: 'What is your name?',
      options: ['Avery', 'Max'],
    },
  ] satisfies SurveyDataQuestion[]),
};

describe('SurveyTemplateController', () => {
  let controller: SurveyTemplateController;

  const expectedResult: SurveyDataQuestion[] = [
    {
      question: 'What is your name?',
      options: ['Avery', 'Max'],
    },
  ];

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
    expect(await controller.getById(1)).toEqual(expectedResult);
    expect(serviceMock.getById).toHaveBeenCalledWith(mockSurveyTemplate.id);
  });
});
