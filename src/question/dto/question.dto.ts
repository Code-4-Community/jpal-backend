// question.dto.ts - Updated with lazy resolvers
import { ApiProperty } from '@nestjs/swagger';
import { OptionDto, OptionCreateDto } from '../../option/dto/option.dto';
import { SentenceDto, SentenceCreateDto } from '../../sentence/dto/sentence.dto';

export class QuestionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty({ type: () => [OptionDto], required: false }) // Use lazy resolver
  options?: OptionDto[];

  @ApiProperty({ type: () => SentenceDto, required: false }) // Use lazy resolver
  sentence?: SentenceDto;
}

export class QuestionCreateDto {
  @ApiProperty()
  text: string;

  @ApiProperty({ type: () => [OptionCreateDto], required: false }) // Use lazy resolver
  options?: OptionCreateDto[];

  @ApiProperty({ type: () => SentenceCreateDto, required: false }) // Use lazy resolver
  sentence?: SentenceCreateDto;
}
