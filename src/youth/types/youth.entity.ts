import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { YouthRoles } from './youthRoles';

@Entity()
export class Youth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: YouthRoles,
    default: YouthRoles.TREATMENT,
  })
  role: YouthRoles;
}
