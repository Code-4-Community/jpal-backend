import { Youth } from '../youth/types/youth.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { youthExamples } from 'src/youth/youth.examples';

export default class CreateYouth implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Youth)
      .values(youthExamples)
      .execute();
  }
}
