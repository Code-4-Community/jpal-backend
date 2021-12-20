import { Youth } from '../youth/types/youth.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateYouth implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Youth)
      .values([
        {
          email: 'c4cneu.jpal+controlyouth@gmail.com',
          firstName: 'control',
          lastName: 'youth',
          isControl: true,
        },
        {
          email: 'c4cneu.jpal+treatmentyouth@gmail.com',
          firstName: 'treatment',
          lastName: 'youth',
          isControl: false,
        },
      ])
      .execute();
  }
}
