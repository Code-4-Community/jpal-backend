import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Patch
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Survey } from './types/survey.entity';
import { SurveyService } from './survey.service';
import { Role } from '../user/types/role';
import { ReqUser } from '../auth/decorators/user.decorator';
import { CreateBatchAssignmentsDto } from './dto/create-batch-assignments.dto';
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
  create(@Body() createSurveyDto: CreateSurveyDto, @ReqUser() reqUser): Promise<Survey> {
    return this.surveyService.create(
      createSurveyDto.surveyTemplateId,
      createSurveyDto.name,
      reqUser,
    );
  }

  @Patch()
  @Auth(Role.RESEARCHER, Role.ADMIN)
  async createBatchAssignments(
    @Body() createBatchAssignmentsDto: CreateBatchAssignmentsDto,
  ): Promise<void> {
    await this.surveyService.createBatchAssignments(createBatchAssignmentsDto);
  }

  @Get(':uuid')
  @Auth(Role.RESEARCHER, Role.ADMIN)
  getByUUID(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<Survey> {
    return this.surveyService.getByUUID(uuid);
  }

  @Get()
  @Auth(Role.ADMIN, Role.RESEARCHER)
  findAllSurveys(@ReqUser() user: User): Promise<Survey[]> {
    return this.surveyService.findAllSurveys(user);
  }
}
