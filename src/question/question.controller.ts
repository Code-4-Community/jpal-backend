import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Put } from '@nestjs/common';
import { QuestionData, QuestionService, QuestionTextData } from './question.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  /**
   * Gets all the questions.
   */
  @Get('/questions')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async getAllQuestions(): Promise<QuestionData[]> {
    return await this.questionService.getAllQuestions();
  }

  /**
   * Updates the text of a fragment
   * @param id   id of the fragment to be updated
   * @param text the new text of the fragment
   */
  @Put('/questions/:id')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editQuestionText(id: number, text: string): Promise<QuestionTextData> {
    return this.questionService.updateQuestionText(id, text);
  }
}
