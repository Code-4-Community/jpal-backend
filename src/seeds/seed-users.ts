import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from '../user/types/role';
import { User } from '../user/types/user.entity';
import { SurveyTemplate } from '../survey-template/types/survey-template.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          email: 'c4cneu.jpal+admin@gmail.com',
          role: Role.ADMIN,
        },
        {
          email: 'c4cneu.jpal+researcher@gmail.com',
          role: Role.RESEARCHER,
        },
      ])
      .execute();

    const user = await connection
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .getOne();

    await connection
      .createQueryBuilder()
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
