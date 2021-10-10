import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './types/survey.entity';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, SurveyTemplate])],
  providers: [SurveyService],
  controllers: [SurveyController],
})
export class SurveyModule {}
