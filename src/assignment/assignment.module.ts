import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { Assignment } from './types/assignment.entity';
import { Response } from '../response/types/response.entity';
import { Question } from '../question/types/question.entity';
import { Option } from '../option/types/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Option, Question, Response])],
  providers: [AssignmentService],
  controllers: [AssignmentController],
})
export class AssignmentModule {}
