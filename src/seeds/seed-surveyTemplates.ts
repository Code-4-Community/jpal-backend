import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { DEFAULT_SURVEY_QUESTIONS } from '../util/letter-generation/examples';
import { Question } from '../question/types/question.entity';

export default class CreateSurveyTemplates implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const users = await connection.getRepository('user').findByIds([1]);

    const savedQuestions = await connection.getRepository(Question).save(DEFAULT_SURVEY_QUESTIONS);

    const surveyTemplate = await connection.getRepository(SurveyTemplate).save({
      creator: users[0],
      name: 'Default Survey Template',
      questions: savedQuestions,
      greeting: 'To Whom It May Concern:',
      closing: 'Sincerely,',
    });

    return surveyTemplate;
  }
}
