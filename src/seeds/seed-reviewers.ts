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
          email: 'c4cneu.jpal+reviewer@gmail.com',
          firstName: 'reviewer',
          lastName: 'user',
        },
      ])
      .execute();
  }
}
