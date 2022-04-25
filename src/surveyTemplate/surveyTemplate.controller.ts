import { BadRequestException, Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { SurveyTemplateService } from "./surveyTemplate.service";
import { SurveyTemplate } from "./types/surveyTemplate.entity";
import { Auth } from "../auth/decorators/auth.decorator";
import { Role } from "../user/types/role";

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
}
