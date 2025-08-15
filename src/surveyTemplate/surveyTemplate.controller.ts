import { Controller, Get, Param, ParseIntPipe, Post, Delete, Put, Body } from '@nestjs/common';
import {
  SurveyNameData,
  SurveyTemplateData,
  SurveyTemplateService,
} from './surveyTemplate.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { Question } from '../question/types/question.entity';
import { DeleteResult } from 'typeorm';
import { ReqUser } from '../auth/decorators/user.decorator';
import { CreateSurveyTemplateDto } from './dto/createSurveyTemplate.dto';

@Controller('survey-template')
export class SurveyTemplateController {
  constructor(private surveyTemplateService: SurveyTemplateService) {}

  /**
   * Gets the survey template corresponding to id.
   */
  @Get(':id')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async getById(@Param('id', ParseIntPipe) id: number): Promise<SurveyTemplateData> {
    return await this.surveyTemplateService.getById(id);
  }

  /**
   * Get all survey templates created by a given creator.
   */
  @Get()
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async getByCreator(@ReqUser() reqUser): Promise<SurveyNameData[]> {
    return await this.surveyTemplateService.getByCreator(reqUser);
  }

  /**
   * Update the questions of a survey template
   * @param id             id of the survey to modify
   * @param questions      new set of questions for the survey template
   */
  @Put(':id/questions')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editSurveyTemplate(id: number, questions: Question[]): Promise<SurveyTemplateData> {
    return await this.surveyTemplateService.updateSurveyTemplate(id, questions);
  }

  /**
   * Update the name of a survey template
   * @param id   id of the survey template to be updated
   * @param name the new name for the survey template
   */
  @Put(':id/name')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editSurveyTemplateName(id: number, name: string): Promise<SurveyTemplateData> {
    return this.surveyTemplateService.updateSurveyTemplateName(id, name);
  }

  /**
   * Delete a survey template
   * @param id    id of the survey template to be deleted
   */
  @Delete('id')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async deleteSurveyTemplate(id: number): Promise<DeleteResult> {
    return await this.surveyTemplateService.deleteSurveyTemplate(id);
  }

  /**
   * Creates a survey template
   */
  @Post()
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async createSurveyTemplate(
    @Body() createSurveyTemplate: CreateSurveyTemplateDto,
  ): Promise<CreateSurveyTemplateDto> {
    const createdSurveyTemplate = await this.surveyTemplateService.createSurveyTemplate(
      createSurveyTemplate.creator,
      createSurveyTemplate.name,
      createSurveyTemplate.questions,
      createSurveyTemplate.greeting,
      createSurveyTemplate.closing,
      createSurveyTemplate.paragraphs,
    );

    return {
      creator: createdSurveyTemplate.creator,
      name: createdSurveyTemplate.name,
      questions: createdSurveyTemplate.questions,
      greeting: createdSurveyTemplate.greeting,
      closing: createdSurveyTemplate.closing,
      paragraphs: createdSurveyTemplate.paragraphs,
    };
  }
}
