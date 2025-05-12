import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { Repository } from 'typeorm';
import { transformQuestionToSurveyDataQuestion } from '../util/transformQuestionToSurveryDataQuestion';

export interface SurveyDataQuestion {
  question: string;
  options: string[];
}

@Injectable()
export class SurveyTemplateService {
  constructor(
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
  ) {}

  /**
   * Gets the survey template corresponding to id.
   */
  async getById(id: number): Promise<SurveyDataQuestion[]> {
    const result = await this.surveyTemplateRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });

    if (!result) {
      throw new BadRequestException(`Survey template id ${id} not found`);
    }

    return transformQuestionToSurveyDataQuestion(result.questions);
  }
}
