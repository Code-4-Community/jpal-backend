import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './roles';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({
    unique: true,
  })
  @IsEmail()
  @ApiProperty()
  email: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.ADMIN,
  })
  @ApiProperty({
    enum: Roles,
  })
  role: Roles;

  @Column()
  @ApiProperty({
    minLength: 8,
  })
  password: string;
}
