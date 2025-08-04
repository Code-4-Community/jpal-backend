import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionService, UploadMultiQuestionData, UploadQuestionData } from './question.service';
import { UploadQuestionResponseDTO, UploadQuestionsDTO } from './dto/upload-question.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { QuestionData } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  /**
   * Route for bulk creating questions, multi-questions, and plain text sentences
   * @param uploadQuestionsDTO
   */
  @Post()
  @Auth(Role.RESEARCHER)
  async create(@Body() uploadQuestionsDTO: UploadQuestionsDTO): Promise<UploadQuestionResponseDTO> {
    const uploadQuestionData: UploadQuestionData[] = [];
    for (const question of uploadQuestionsDTO.questions) {
      uploadQuestionData.push(
        new UploadQuestionData(
          question.text,
          question.options,
          question.sentence_template,
          question.include_if_selected_options,
        ),
      );
    }

    const multiQuestionData: UploadMultiQuestionData[] = [];
    for (const question of uploadQuestionsDTO.multi_questions) {
      multiQuestionData.push(
        new UploadMultiQuestionData(
          question.sentence_template,
          question.fragment_texts,
          question.question_texts,
          question.options,
          question.include_if_selected_option,
        ),
      );
    }

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
   * Gets all the questions.
   */
  @Get('/questions')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async getAllQuestions(): Promise<QuestionData[]> {
    return await this.questionService.getAllQuestions();
  }
}
