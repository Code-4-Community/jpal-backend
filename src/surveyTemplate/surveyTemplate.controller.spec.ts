import { Test, TestingModule } from '@nestjs/testing';
import { SurveyTemplateController } from './surveyTemplate.controller';
import { SurveyTemplateService } from './surveyTemplate.service';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { mockUser } from '../user/user.service.spec';

const mockSurveyTemplate: SurveyTemplate = { id: 1, creator: mockUser, questions: [] };

const serviceMock: Partial<SurveyTemplateService> = {
  getById: jest.fn(() => Promise.resolve(mockSurveyTemplate)),
};

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
    expect(await controller.getById(1)).toEqual(mockSurveyTemplate);
    expect(serviceMock.getById).toHaveBeenCalledWith(mockSurveyTemplate.id);
  });
});
