import { Test, TestingModule } from '@nestjs/testing';
import { SurveyTemplateController } from './surveyTemplate.controller';

describe('SurveyTemplateController', () => {
  let controller: SurveyTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyTemplateController],
    }).compile();

    controller = module.get<SurveyTemplateController>(SurveyTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
