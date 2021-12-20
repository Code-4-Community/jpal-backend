import { Youth } from '../youth/types/youth.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { YouthRoles } from '../youth/types/youthRoles';

export default class CreateYouth implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Youth)
      .values([
        {
          email: 'c4cneu.jpal+joe.shmoe@gmail.com',
          firstName: 'Joe',
          lastName: 'Shmoe',
          role: YouthRoles.CONTROL,
        },
        {
          email: 'c4cneu.jpal+nash.ville@gmail.com',
          firstName: 'Nash',
          lastName: 'Ville',
          role: YouthRoles.CONTROL,
        },
        {
          email: 'c4cneu.jpal+jane.doe@gmail.com',
          firstName: 'Jane',
          lastName: 'Doe',
          role: YouthRoles.CONTROL,
        },
        {
          email: 'c4cneu.jpal+ada.lovelace@gmail.com',
          firstName: 'Ada',
          lastName: 'Lovelace',
          role: YouthRoles.TREATMENT,
        },
        {
          email: 'c4cneu.jpal+alan.turing@gmail.com',
          firstName: 'Alan',
          lastName: 'Turing',
          role: YouthRoles.TREATMENT,
        },
        {
          email: 'c4cneu.jpal+george.washington@gmail.com',
          firstName: 'George',
          lastName: 'Washington',
          role: YouthRoles.TREATMENT,
        },
      ])
      .execute();
  }
}
