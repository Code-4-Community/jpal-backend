import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Survey } from './types/survey.entity';
import { SurveyService } from './survey.service';
import { Role } from '../user/types/role';
import { ReqUser } from '../auth/decorators/user.decorator';
import { User } from '../user/types/user.entity';

@Controller('survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  /**
   * Create a new survey with the given user and survey template. Must be authenticated as a Researcher or a Admin.
   * @param createSurveyDto
   * @param reqUser
   * @returns Survey
   */
  @Post()
  @Auth(Role.RESEARCHER, Role.ADMIN)
  create(
    @Body() createSurveyDto: CreateSurveyDto,
    @ReqUser() reqUser,
  ): Promise<Survey> {
    return this.surveyService.create(
      createSurveyDto.surveyTemplateId,
      createSurveyDto.name,
      reqUser,
    );
  }

  /**
   * Get a survey by its UUID. Must be authenticated as a Researcher or a Admin.
   * @param uuid
   * @returns Survey
   */
  @Get(':uuid')
  @Auth(Role.RESEARCHER, Role.ADMIN)
  getSurveyByUUID(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<Survey> {
    return this.surveyService.getSurveyByUUID(uuid);
  }

  /**
   * Returns all surveys by the currently logged in user
   */
  @Get()
  @Auth(Role.ADMIN || Role.RESEARCHER)
  findAllSurveys(@ReqUser() user: User): Promise<Survey[]> {
    return this.surveyService.findAllSurveys(user);
  }
}
