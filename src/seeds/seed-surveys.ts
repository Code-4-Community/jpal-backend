import { Survey } from '../survey/types/survey.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateSurveys implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const users = await connection.getRepository('user').findByIds([1]);
    const surveyTemplates = await connection
      .getRepository('survey_template')
      .findByIds([1]);

    await connection
      .createQueryBuilder()
      .insert()
      .into(Survey)
      .values([
        {
          creator: users[0],
          surveyTemplate: surveyTemplates[0],
          name: 'Demo Survey',
        },
      ])
      .execute();
  }
}
