import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../question/types/question.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { Fragment } from './types/fragment.entity';
import { FragmentService } from './fragment.service';
import { FragmentController } from './fragment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Sentence, Fragment])],
  providers: [FragmentService],
  controllers: [FragmentController],
})
export class FragmentModule {}
