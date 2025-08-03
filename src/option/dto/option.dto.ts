// option.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class OptionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;
}

export class OptionCreateDto {
  @ApiProperty()
  text: string;
}
