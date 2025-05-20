import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Question } from '../question/types/question.entity';

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
    const result = await this.surveyTemplateRepository.findOne({
      where: { id: id },
    });

    if (!result) {
      throw new BadRequestException(`Survey template id ${id} not found`);
    } else {
      return result;
    }
  }

  /**
   * Update the questions of a survey template
   * @param id             id of the survey to modify
   * @param questions      new set of questions for the survey template
   */
  async updateSurveyTemplate(id: number, questions: Question[]): Promise<SurveyTemplate> {
    const surveyTemplate = await this.getTemplateById(id);
    surveyTemplate.questions = questions;
    return this.surveyTemplateRepository.save(surveyTemplate)
  }

  /**
   * Delete a survey template
   * @param id    id of the survey template to be deleted
   */
  async deleteSurveyTemplate(id: number): Promise<DeleteResult> {
    try {
      await this.getTemplateById(id);
    } catch (BadRequestException) {
      throw new BadRequestException(`Survey template id ${id} not found`);
    }
    return this.surveyTemplateRepository.delete(id);
  }


  private async getTemplateById(id: number): Promise<SurveyTemplate> {
    const result = await this.surveyTemplateRepository.findOne({
      where: { id: id },
    });

    if (!result) {
      throw new BadRequestException(`Survey template id ${id} not found`);
    } else {
      return result;
    }
  }
}
