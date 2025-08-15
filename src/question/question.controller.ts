import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Delete } from '@nestjs/common';
import { QuestionData, QuestionService } from './question.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { DeleteResult } from 'typeorm';
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
   * Deletes a question by ID.
   * @param id The ID of the question to delete.
   * @returns A promise that resolves when the question is deleted.
   */
  @Delete(':id')
  @Auth(Role.RESEARCHER)
  async deleteQuestion(@Param('id') id: number): Promise<DeleteResult> {
    return await this.questionService.deleteQuestion(id);
  }
}
