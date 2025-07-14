import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Question } from '../question/types/question.entity';
import { transformQuestionToSurveyDataQuestion } from '../util/transformQuestionToSurveryDataQuestion';
import { User } from 'src/user/types/user.entity';

export interface SurveyDataQuestion {
  question: string;
  options: string[];
}

export interface SurveyTemplateData {
  name: string;
  questions: SurveyDataQuestion[];
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
  async getById(id: number): Promise<SurveyTemplateData> {
    const result = await this.surveyTemplateRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });

    if (!result) {
      throw new BadRequestException(`Survey template id ${id} not found`);
    }

    return {
      name: result.name,
      questions: transformQuestionToSurveyDataQuestion(result.questions),
    };
  }

  /**
   * Update the questions of a survey template
   * @param id             id of the survey to modify
   * @param questions      new set of questions for the survey template
   */
  async updateSurveyTemplate(id: number, questions: Question[]): Promise<SurveyTemplateData> {
    const surveyTemplate = await this.getTemplateById(id);
    surveyTemplate.questions = questions;
    await this.surveyTemplateRepository.save(surveyTemplate);
    return {
      name: surveyTemplate.name,
      questions: transformQuestionToSurveyDataQuestion(questions),
    };
  }

  /**
   * Update the name of a survey template
   * @param id           the id of the survey to modify
   * @param name         the new name of the survey template
   */
  async updateSurveyTemplateName(id: number, name: string): Promise<SurveyTemplateData> {
    const surveyTemplate = await this.getTemplateById(id);
    surveyTemplate.name = name;
    await this.surveyTemplateRepository.save(surveyTemplate);
    return {
      name: name,
      questions: transformQuestionToSurveyDataQuestion(surveyTemplate.questions),
    };
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

  /**
   * Creates a survey template
   * @param creator is the creator of the survey template
   * @param name is the name of the survey template
   * @questions questions are the questions apart of the survey template
   */
  async createSurveyTemplate(creator: User, name : string, questions: Question[]) {
    return this.surveyTemplateRepository.save({
      creator,
      name,
      questions,
    });
  }
}
