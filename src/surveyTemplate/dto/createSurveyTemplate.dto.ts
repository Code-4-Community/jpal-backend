import { Role } from '../../user/types/role';

export class QuestionCreateDto {
  id: number
}

export class UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdDate: Date;
}

export class CreateSurveyTemplateDto {
  name: string;
  questions: QuestionCreateDto[];
}

export class CreateSurveyTemplateResponseDto {
  creator: UserDto;
  name: string;
  questions: { text: string }[];
}