import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  QuestionService,
  UploadMultiQuestionData,
  UploadQuestionData,
  QuestionData,
} from './question.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { UploadQuestionResponseDTO, UploadQuestionsDTO } from './dto/upload-question.dto';
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
}
