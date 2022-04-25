import { userExamples } from '../user/user.examples';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../user/types/user.entity';
import { SurveyTemplate } from 'src/surveyTemplate/types/surveyTemplate.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.createQueryBuilder().insert().into(User).values(userExamples).execute();

    const user = await connection
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .getOne();

    await connection.createQueryBuilder()
      .insert()
      .into(SurveyTemplate)
      .values([
        {
          creator: user,
          questions: [],
        },
      ])
      .execute();
  }
}
