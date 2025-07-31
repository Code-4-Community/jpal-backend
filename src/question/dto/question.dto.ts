import { OptionDto, OptionCreateDto } from '../../option/dto/option.dto';
import { SentenceDto, SentenceCreateDto } from '../../sentence/dto/sentence.dto';

export class QuestionDto {
  id: number;
  text: string;
  options?: OptionDto[];
  sentence?: SentenceDto;
}

export class QuestionCreateDto {
  text: string;
  options?: OptionCreateDto[];
  sentence?: SentenceCreateDto;
}