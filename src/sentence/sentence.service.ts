import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sentence } from './types/sentence.entity';

export interface SentenceTemplateData {
  id: number;
  template: string;
}

@Injectable()
export class SentenceService {
  constructor(
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
  ) {}

  /**
   * Gets the sentence corresponding to id.
   */
  async getById(id: number): Promise<SentenceTemplateData> {
    const result = await this.sentenceRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new BadRequestException(`Sentence id ${id} not found`);
    }

    return {
      id: result.id,
      template: result.template,
    };
  }

  /**
   * Update the template of a sentence
   * @param id             id of the sentence to modify
   * @param template   new template for the sentence
   */
  async updateSentenceTemplate(id: number, template: string): Promise<SentenceTemplateData> {
    const sentence = await this.getById(id);
    sentence.template = template;
    await this.sentenceRepository.save(sentence);
    return {
      id: sentence.id,
      template: sentence.template,
    };
  }
}
