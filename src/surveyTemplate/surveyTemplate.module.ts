import { Module } from '@nestjs/common';
import { SurveyTemplateService } from './surveyTemplate.service';
import { SurveyTemplateController } from "./surveyTemplate.controller";

@Module({
  controllers: [SurveyTemplateController],
  providers: [SurveyTemplateService],
  exports: [SurveyTemplateService],
})
export class SurveyTemplateModule {}
