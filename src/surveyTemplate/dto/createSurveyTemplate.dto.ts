// createSurveyTemplate.dto.ts - Updated with lazy resolvers
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

  @ApiProperty({ type: () => [QuestionBasicDto] })  // Use lazy resolver
  questions: QuestionBasicDto[];
}

export class CreateSurveyTemplateResponseDto {
  @ApiProperty({ type: () => UserDto })  // Use lazy resolver
  creator: UserDto;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [{ text: String }] })  // This is fine as is
  questions: { text: string }[];
}