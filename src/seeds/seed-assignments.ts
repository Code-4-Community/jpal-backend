import { Assignment } from '../assignment/types/assignment.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateAssignments implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const reviewers = await connection.getRepository('reviewer').findByIds([1]);
    const youth = await connection.getRepository('youth').findByIds([1]);
    const surveys = await connection.getRepository('survey').findByIds([1]);

    await connection
      .createQueryBuilder()
      .insert()
      .into(Assignment)
      .values([
        {
          reviewer: reviewers[0],
          youth: youth[0],
          survey: surveys[0],
        },
      ])
      .execute();
  }
}
