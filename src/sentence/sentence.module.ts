import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../question/types/question.entity';
import { Sentence } from './types/sentence.entity';
import { Fragment } from '../fragment/types/fragment.entity';
import { SentenceService } from './sentence.service';
import { SentenceController } from './sentence.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Sentence, Fragment])],
  providers: [SentenceService],
  controllers: [SentenceController],
})
export class SentenceModule {}
