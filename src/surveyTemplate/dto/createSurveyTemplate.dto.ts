import { Question } from "src/question/types/question.entity";
import { User } from "src/user/types/user.entity"

export class CreateSurveyTemplateDto {
  creator: User;
  name: string;
  questions: Question[]
}
