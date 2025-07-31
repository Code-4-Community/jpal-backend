import { QuestionDto } from '../../question/dto/question.dto';

export class SentenceDto {
  id: number;
  template: string;
  multiTemplate?: string;
  isPlainText: boolean;
  isMultiQuestion: boolean;
  includeIfSelectedOptions: string[];
  question: QuestionDto;
}

export class SentenceCreateDto {
  template: string;
  multiTemplate?: string;
  isPlainText: boolean;
  isMultiQuestion: boolean;
  includeIfSelectedOptions: string[];
}