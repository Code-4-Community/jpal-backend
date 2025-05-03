import { Question } from '../question/types/question.entity';
import { Question as SurveyDataQuestion } from '../survey/dto/survey-assignment.dto';

export function transformQuestionToSurveyDataQuestion(
  questionEntities: Question[],
): SurveyDataQuestion[] {
  return questionEntities.map((q) => ({
    question: q.text,
    options: q.options.map((o) => o.text),
  }));
}
