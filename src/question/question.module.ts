import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Question } from './types/question.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { Option } from '../option/types/option.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Question, Option, Sentence])],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class SurveyModule {}
