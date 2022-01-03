import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './types/survey.entity';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { Assignment } from '../assignment/types/assignment.entity';
import { Youth } from '../youth/types/youth.entity';
import { Reviewer } from '../reviewer/types/reviewer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, SurveyTemplate, Assignment, Youth, Reviewer])],
  providers: [SurveyService],
  controllers: [SurveyController],
})
export class SurveyModule {}
