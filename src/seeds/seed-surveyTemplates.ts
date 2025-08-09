import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { DEFAULT_SURVEY_QUESTIONS } from '../util/letter-generation/examples';

export default class CreateSurveyTemplates implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const users = await connection.getRepository('user').findByIds([1]);

    await connection.getRepository(SurveyTemplate).save([
      {
        creator: users[0],
        questions: DEFAULT_SURVEY_QUESTIONS,
      },
    ]);
  }
}
