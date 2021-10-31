import { Body, Controller, Get, Post } from '@nestjs/common';
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
   * Returns all surveys by the currently logged in user
   */
  @Get()
  @Auth(Role.ADMIN || Role.RESEARCHER)
  findAllSurveys(@ReqUser() user: User): Promise<Survey[]> {
    return this.surveyService.findAllSurveys(user);
  }
}
