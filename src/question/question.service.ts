import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Question } from './types/question.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { Option } from '../option/types/option.entity';

export interface QuestionData {
  id: number;
  text: string;
  template: string;
  options: string[];
}

export function transformToQuestionData(questionEntities: Question[]): QuestionData[] {
  return questionEntities.map((q) => ({
    id: q.id,
    text: q.text,
    template: q.sentence.template,
    options: q.options.map((o) => o.text),
  }));
}

@Injectable()
export class QuestionService {
  private logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Question) private questionRepository: Repository<Question>,
    @InjectRepository(Sentence) private sentenceRepository: Repository<Sentence>,
    @InjectRepository(Sentence) private optionRepository: Repository<Option>,
  ) {}

  async getAllQuestions(): Promise<QuestionData[]> {
    const result = await this.questionRepository.find({});
    return transformToQuestionData(result);
  }

  /**
   * Deletes a question by ID.
   * @param id The ID of the question to delete.
   * @returns A promise that resolves when the question is deleted.
   */
  async deleteQuestion(id: number): Promise<DeleteResult> {
    try {
      await this.questionRepository.findOne(id);
    } catch (BadRequestException) {
      throw new BadRequestException(`Question id ${id} not found`);
    }
    return await this.questionRepository.delete(id);
  }
}
