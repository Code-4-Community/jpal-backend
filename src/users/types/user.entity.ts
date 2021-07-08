import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './roles';
import { IsEmail } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.ADMIN,
  })
  role: Roles;

  @Column()
  password: string;
}
