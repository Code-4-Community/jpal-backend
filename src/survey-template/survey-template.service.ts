import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyTemplate } from './types/survey-template.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SurveyTemplateService {
  constructor(
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
  ) {}

  /**
   * Gets the survey template corresponding to id.
   */
  async getById(id: number): Promise<SurveyTemplate> {
    return this.surveyTemplateRepository.findOne({
      where: { id: id },
    });
  }
}
