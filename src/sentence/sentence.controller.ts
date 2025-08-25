import { Controller, Get, Param, ParseIntPipe, Post, Delete, Put, Body } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { SentenceService, SentenceTemplateData } from './sentence.service';
import { EditSentenceDto } from './dto/editSentence.dto';
@Controller('sentence')
export class SentenceController {
  constructor(private sentenceService: SentenceService) {}

  /**
   * Updates the template of a sentence
   * @param id   id of the sentence to be updated
   * @param sentenceTemplate the new sentence template for the sentence
   */
  @Put(':id')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editSentenceTemplate(
    @Body() editSentenceTemplate: EditSentenceDto,
  ): Promise<SentenceTemplateData> {
    return this.sentenceService.updateSentenceTemplate(
      editSentenceTemplate.id,
      editSentenceTemplate.sentenceTemplate,
    );
  }
}
