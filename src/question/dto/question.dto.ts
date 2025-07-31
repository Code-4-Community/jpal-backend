// question.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { OptionDto, OptionCreateDto } from '../../option/dto/option.dto';
import { SentenceDto, SentenceCreateDto } from '../../sentence/dto/sentence.dto';

export class QuestionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty({ type: () => [OptionDto], required: false })
  options?: OptionDto[];

  @ApiProperty({ type: () => SentenceDto, required: false })
  sentence?: SentenceDto;
}

export class QuestionCreateDto {
  @ApiProperty()
  text: string;

  @ApiProperty({ type: () => [OptionCreateDto], required: false })
  options?: OptionCreateDto[];

  @ApiProperty({ type: () => SentenceCreateDto, required: false })
  sentence?: SentenceCreateDto;
}