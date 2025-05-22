import { Controller, Get, Param, ParseIntPipe, Post, Delete } from '@nestjs/common';
import { SurveyTemplateService } from './surveyTemplate.service';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { Question } from '../question/types/question.entity';
import { DeleteResult } from 'typeorm';

@Controller('survey-template')
export class SurveyTemplateController {
  constructor(private surveyTemplateService: SurveyTemplateService) {}

  /**
   * Gets the survey template corresponding to id.
   */
  @Get(':id')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async getById(@Param('id', ParseIntPipe) id: number): Promise<SurveyTemplate> {
    return await this.surveyTemplateService.getById(id);
  }

  /**
   * Update the questions of a survey template
   * @param id             id of the survey to modify
   * @param questions      new set of questions for the survey template
   */
  @Post(':edit-survey-template-questions')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editSurveyTemplate(id: number, questions: Question[]): Promise<SurveyTemplate> {
    return await this.surveyTemplateService.updateSurveyTemplate(id, questions);
  }

  /**
   * Update the name of a survey template
   * @param id   id of the survey template to be updated
   * @param name the new name for the survey template
   */
  @Post(':edit-survey-template-name')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editSurveyTemplateName(id: number, name: string): Promise<SurveyTemplate> {
    return this.surveyTemplateService.updateSurveyTemplateName(id, name);
  }

  /**
   * Delete a survey template
   * @param id    id of the survey template to be deleted
   */
  @Delete(':delete-survey-template')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async deleteSurveyTemplate(id: number): Promise<DeleteResult> {
    return await this.surveyTemplateService.deleteSurveyTemplate(id);
  }
}
