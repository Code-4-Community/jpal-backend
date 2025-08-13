import { Controller, Get, Param, ParseIntPipe, Post, Delete, Put, Body } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { SentenceService, SentenceTemplateData } from './sentence.service';

@Controller('sentence')
export class SurveyTemplateController {
  constructor(private sentenceService: SentenceService) {}

  /**
   * Updates the template of a sentence
   * @param id   id of the sentence to be updated
   * @param sentenceTemplate the new sentence template for the sentence
   */
  @Put('/sentence/:id')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editSentenceTemplate(id: number, sentenceTemplate: string): Promise<SentenceTemplateData> {
    return this.sentenceService.updateSentenceTemplate(id, sentenceTemplate);
  }
}
