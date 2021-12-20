import { Reviewer } from '../reviewer/types/reviewer.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateReviewers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Reviewer)
      .values([
        {
          email: 'c4cneu.jpal+ben.lerner@gmail.com',
          firstName: 'Ben',
          lastName: 'Lerner',
        },
        {
          email: 'c4cneu.jpal+alan.mislove@gmail.com',
          firstName: 'Alan',
          lastName: 'Mislove',
        },
      ])
      .execute();
  }
}
