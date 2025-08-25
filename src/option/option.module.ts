import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../question/types/question.entity';
import { Option } from './types/option.entity';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Option])],
  providers: [OptionService],
  controllers: [OptionController],
})
export class OptionModule {}
