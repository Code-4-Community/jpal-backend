import { Roles } from '../types/roles';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  /**
   * A valid email address.
   * @example "jung.ry@northeastern.edu"
   */
  @IsEmail()
  @IsNotEmpty()
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
