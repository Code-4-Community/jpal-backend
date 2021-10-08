import { Module } from '@nestjs/common';
import { SurveyTemplateService } from './survey-template.service';

@Module({
  providers: [SurveyTemplateService],
  exports: [SurveyTemplateService],
})
export class SurveyTemplateModule {}
