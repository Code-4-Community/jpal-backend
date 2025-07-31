import { QuestionDto } from '../../question/dto/question.dto';

export class EditSurveyTemplateDTO {
  id: number;

  questions: QuestionDto[];
}