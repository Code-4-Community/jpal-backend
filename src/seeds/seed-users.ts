import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from '../users/types/role';
import { User } from '../users/types/user.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          email: 'test@test.com',
          role: Role.ADMIN,
          isClaimed: true,
        },
      ])
      .execute();
  }
}
