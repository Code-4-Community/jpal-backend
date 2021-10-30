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

  @Get(':uuid')
  @Auth(Role.RESEARCHER, Role.ADMIN)
  getSurveyByUUID(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<Survey> {
    return this.surveyService.getSurveyByUUID(uuid);
  }
}
