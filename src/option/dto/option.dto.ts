import { QuestionDto } from '../../question/dto/question.dto';

export class OptionDto {
  id: number;
  text: string;
  question: QuestionDto;
}

export class OptionCreateDto {
  text: string;
}