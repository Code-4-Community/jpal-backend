import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Assignment } from '../assignment/types/assignment.entity';

export default class CreateAssignments implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const reviewers = await connection.getRepository('reviewer').find();
    const youth = await connection.getRepository('youth').find();
    const surveys = await connection.getRepository('survey').find();

    console.log('\ncreating assignments:');
    console.log(`survey/${(surveys[0] as any).uuid}/${(reviewers[0] as any).uuid}`);
    console.log(`survey/${(surveys[0] as any).uuid}/${(reviewers[1] as any).uuid}`);

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
        {
          reviewer: reviewers[0],
          youth: youth[1],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[0],
          youth: youth[2],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[0],
          youth: youth[3],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[0],
          youth: youth[4],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[0],
          youth: youth[5],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[1],
          youth: youth[0],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[1],
          youth: youth[1],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[1],
          youth: youth[2],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[1],
          youth: youth[3],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[1],
          youth: youth[4],
          survey: surveys[0],
        },
        {
          reviewer: reviewers[1],
          youth: youth[5],
          survey: surveys[0],
        },
      ])
      .execute();
  }
}
