import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';

export default class CreateSurveyTemplates implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const users = await connection.getRepository('user').findByIds([1]);

    await connection
      .createQueryBuilder()
      .insert()
      .into(SurveyTemplate)
      .values([
        {
          creator: users[0],
        },
      ])
      .execute();
  }
}
