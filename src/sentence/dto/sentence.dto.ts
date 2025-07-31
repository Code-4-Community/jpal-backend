// sentence.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SentenceDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  template: string;

  @ApiProperty({ required: false })
  multiTemplate?: string;

  @ApiProperty()
  isPlainText: boolean;

  @ApiProperty()
  isMultiQuestion: boolean;

  @ApiProperty({ type: [String] })
  includeIfSelectedOptions: string[];
}

export class SentenceCreateDto {
  @ApiProperty()
  template: string;

  @ApiProperty({ required: false })
  multiTemplate?: string;

  @ApiProperty()
  isPlainText: boolean;

  @ApiProperty()
  isMultiQuestion: boolean;

  @ApiProperty({ type: [String] })
  includeIfSelectedOptions: string[];
}