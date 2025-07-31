import { ApiProperty } from '@nestjs/swagger';
import { QuestionDto } from '../../question/dto/question.dto';

export class EditSurveyTemplateDTO {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => [QuestionDto] })  // Use lazy resolver
  questions: QuestionDto[];
}