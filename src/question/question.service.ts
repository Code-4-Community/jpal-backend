import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './types/question.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { Option } from '../option/types/option.entity';

export interface QuestionData {
  id: number;
  text: string;
  template: string;
  options: string[];
}

export interface QuestionTextData {
  id: number;
  text: string;
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

  /**
   *
   * Gets all the questions
   */
  async getAllQuestions(): Promise<QuestionData[]> {
    const result = await this.questionRepository.find({});
    return transformToQuestionData(result);
  }

  /**
   * Gets the question corresponding to the given id.
   */
  async getById(id: number): Promise<QuestionTextData> {
    const result = await this.questionRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new BadRequestException(`Question id ${id} not found`);
    }

    return {
      id: result.id,
      text: result.text,
    };
  }

  /**
   * Update the text of a question
   * @param id             id of the question to modify
   * @param text   new text for the question
   */
  async updateQuestionText(id: number, text: string): Promise<QuestionTextData> {
    const question = await this.getById(id);
    question.text = text;
    await this.questionRepository.save(question);
    return {
      id: question.id,
      text: question.text,
    };
  }
}
