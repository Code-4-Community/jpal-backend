import { Test, TestingModule } from '@nestjs/testing';
import { SurveyTemplateService } from './surveyTemplate.service';

describe('SurveyTemplateService', () => {
  let service: SurveyTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyTemplateService],
    }).compile();

    service = module.get<SurveyTemplateService>(SurveyTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
