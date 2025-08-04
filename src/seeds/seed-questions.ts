import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Question } from '../question/types/question.entity';
import { DEFAULT_SURVEY_QUESTIONS } from '../util/letter-generation/examples';

export default class CreateSurveyTemplates implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const users = await connection.getRepository('user').findByIds([1]);

    await connection.getRepository(Question).save(DEFAULT_SURVEY_QUESTIONS);
  }
}