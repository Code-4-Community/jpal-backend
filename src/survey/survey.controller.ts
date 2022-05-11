import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { ReqUser } from '../auth/decorators/user.decorator';
import { Role } from '../user/types/role';
import { User } from '../user/types/user.entity';
import { CreateBatchAssignmentsDto } from './dto/create-batch-assignments.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyData } from './dto/survey-assignment.dto';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';

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
    await this.surveyService.sendEmailToReviewersInBatchAssignment(createBatchAssignmentsDto);
  }

  @Get(':surveyUuid/:reviewerUuid')
  async getReviewerSurvey(
    @Param('surveyUuid', ParseUUIDPipe) surveyUuid: string,
    @Param('reviewerUuid', ParseUUIDPipe) reviewerUuid: string,
  ): Promise<SurveyData> {
    return await this.surveyService.getReviewerSurvey(surveyUuid, reviewerUuid);
  }

  @Get(':uuid')
  @Auth(Role.RESEARCHER, Role.ADMIN)
  getByUUID(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<Survey> {
    return this.surveyService.getByUUID(uuid);
  }

  @Get()
  @Auth(Role.ADMIN, Role.RESEARCHER)
  findAllSurveys(@ReqUser() user: User): Promise<Survey[]> {
    if (user.role == Role.ADMIN) {
      return this.surveyService.findAllSurveysByUser(user);
    } else if (user.role == Role.RESEARCHER) {
      return this.surveyService.getAllSurveys();
    }
  }
}
