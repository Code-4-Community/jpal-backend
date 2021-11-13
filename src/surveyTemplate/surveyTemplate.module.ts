import { Module } from '@nestjs/common';
import { SurveyTemplateService } from './surveyTemplate.service';
import { SurveyTemplateController } from "./surveyTemplate.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SurveyTemplate } from "./types/surveyTemplate.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SurveyTemplate])],
  controllers: [SurveyTemplateController],
  providers: [SurveyTemplateService],
  exports: [SurveyTemplateService],
})
export class SurveyTemplateModule {}
