import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { Survey } from '../survey/types/survey.entity';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { Assignment } from './types/assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Survey, SurveyTemplate])],
  providers: [AssignmentService],
  controllers: [AssignmentController],
})
export class AssignmentModule {}
