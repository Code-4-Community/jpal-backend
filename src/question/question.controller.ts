import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UploadMultiQuestionData, UploadQuestionData } from './question.service';
import { QuestionData, QuestionService, QuestionTextData } from './question.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { UploadQuestionResponseDTO, UploadQuestionsDTO } from './dto/upload-question.dto';
import { DeleteResult } from 'typeorm';
import { EditDto } from '../util/dto/edit.dto';
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
  @Put(':id')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editQuestionText(@Body() editQuestionText: EditDto)
  : Promise<QuestionTextData> {
    return this.questionService.updateQuestionText(editQuestionText.id, editQuestionText.text);
  }

  /**
   * Route for bulk creating questions, multi-questions, and plain text sentences
   * @param uploadQuestionsDTO
   */
  @Post()
  @Auth(Role.RESEARCHER)
  async create(@Body() uploadQuestionsDTO: UploadQuestionsDTO): Promise<UploadQuestionResponseDTO> {
    const uploadQuestionData = uploadQuestionsDTO.questions.map((question) => ({
      text: question.text,
      options: question.options,
      sentence_template: question.sentence_template,
      include_if_selected_options: question.include_if_selected_options,
    }));

    const multiQuestionData: UploadMultiQuestionData[] = uploadQuestionsDTO.multi_questions.map(
      (question) => ({
        sentence_template: question.sentence_template,
        fragment_texts: question.fragment_texts,
        question_texts: question.question_texts,
        options: question.options,
        include_if_selected_option: question.include_if_selected_option,
      }),
    );

    const numberOfQuestions = await this.questionService.batchCreateQuestions(uploadQuestionData);

    const numberOfMultiQuestions = await this.questionService.batchCreateMultiQuestions(
      multiQuestionData,
    );
    const numberOfPlainText = await this.questionService.batchCreatePlainText(
      uploadQuestionsDTO.plain_text,
    );

    return {
      questions: numberOfQuestions,
      multi_question_sentences: numberOfMultiQuestions,
      plain_text_sentences: numberOfPlainText,
    };
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
