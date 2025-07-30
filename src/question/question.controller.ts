import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { QuestionData, QuestionService } from './question.service';
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
}
