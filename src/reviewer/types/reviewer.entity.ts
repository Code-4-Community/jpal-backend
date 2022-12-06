import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity()
export class Reviewer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @Generated('uuid')
  uuid: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    default: null,
  })
  secondaryEmail?: string;

  @Column({
    default: null,
  })
  phone?: string;
}
