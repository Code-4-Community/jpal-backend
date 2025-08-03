// createSurveyTemplate.dto.ts - Updated with lazy resolvers
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../user/types/role';
import { QuestionDto } from '../../question/dto/question.dto';

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

export class CreateSurveyTemplateDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [QuestionDto] }) // Use lazy resolver
  questions: QuestionDto[];
}

export class CreateSurveyTemplateResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => UserDto }) // Use lazy resolver
  creator: UserDto;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [{ text: String }] }) // This is fine as is
  questions: { text: string }[];
}
