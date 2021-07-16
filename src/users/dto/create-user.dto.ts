import { Roles } from '../types/roles';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  /**
   * A valid email address.
   * @example "jung.ry@northeastern.edu"
   */
  @IsEmail()
  email: string;

  @IsEnum(Roles)
  role: Roles;

  /**
   * A valid password.
   * @example "password123"
   */
  @MinLength(8)
  password: string;
}
