import { IsArray } from 'class-validator';

class SingleQuestionDTO {
  text: string;

  @IsArray()
  options: string[];

  sentence_template: string;

  @IsArray()
  include_if_selected_options: string[];
}

class MultiQuestionDTO {
  sentence_template: string;

  @IsArray()
  fragment_texts: string[];

  @IsArray()
  question_texts: string[];

  @IsArray()
  options: string[][];

  @IsArray()
  include_if_selected_option: string[];
}

export class UploadQuestionsDTO {
  @IsArray()
  questions: SingleQuestionDTO[];

  @IsArray()
  multi_questions: MultiQuestionDTO[];

  @IsArray()
  plain_text: string[];
}

export class UploadQuestionResponseDTO {
  questions: number;
  multi_question_sentences: number;
  plain_text_sentences: number;
}
