export class UploadQuestionsDTO {
  questions: {
    text: string;
    options: string[];
    sentence_template: string;
    include_if_selected_options: string[];
  }[];
  multi_questions: {
    sentence_template: string;
    fragment_texts: string[];
    question_texts: string[];
    options: string[][];
    include_if_selected_option: string[];
  }[];
  plain_text: string[];
}

export class UploadQuestionResponseDTO {
  questions: number;
  multi_question_sentences: number;
  plain_text_sentences: number;
}
