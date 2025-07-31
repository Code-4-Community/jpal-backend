// createSurveyTemplate.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../user/types/role';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  createdDate: Date;
}

export class QuestionBasicDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  text: string;
}

export class CreateSurveyTemplateDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [QuestionBasicDto] })
  questions: QuestionBasicDto[];
}

export class CreateSurveyTemplateResponseDto {
  @ApiProperty({ type: () => UserDto })
  creator: UserDto;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [{ text: String }] })
  questions: { text: string }[];
}