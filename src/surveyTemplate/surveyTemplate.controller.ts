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
import {
  CreateSurveyTemplateDto,
  CreateSurveyTemplateResponseDto,
} from './dto/createSurveyTemplate.dto';
import { EditSurveyTemplateDTO } from './dto/editSurveyTemplateQuestions.dto';

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
  async editSurveyTemplateName(
    @Param('id', ParseIntPipe) id: number, // Add this
    @Body('name') name: string, // And this for the body
  ): Promise<SurveyTemplateData> {
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
  @Post('survey-template')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async createSurveyTemplate(
    @Body() createSurveyTemplate: CreateSurveyTemplateDto,
    @ReqUser() reqUser,
  ): Promise<CreateSurveyTemplateResponseDto> {
    // Transform DTOs to the format expected by the service
    const questions = createSurveyTemplate.questions.map((questionDto) => ({
      ...questionDto,
      options: questionDto.options?.map((optionDto) => ({
        ...optionDto,
        question: null, // Will be set by the service
      })),
      sentence: questionDto.sentence
        ? {
            ...questionDto.sentence,
            question: null, // Will be set by the service
          }
        : undefined,
    }));

    const createdSurveyTemplate = await this.surveyTemplateService.createSurveyTemplate(
      reqUser,
      createSurveyTemplate.name,
      questions,
    );

    return {
      id: createdSurveyTemplate.id,
      creator: reqUser,
      name: createdSurveyTemplate.name,
      questions: createdSurveyTemplate.questions.map((q) => ({ text: q.text })),
    };
  }
}
