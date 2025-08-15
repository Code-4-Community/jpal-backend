import { Paragraph } from '../../paragraph/types/paragraph.entity';
import { Question } from '../../question/types/question.entity';
import { User } from '../../user/types/user.entity';

export class CreateSurveyTemplateDto {
  creator: User;
  name: string;
  questions: Question[];
  greeting: string;
  closing: string;
  paragraphs: Paragraph[];
}
