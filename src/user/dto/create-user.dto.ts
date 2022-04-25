import { IsEmail, IsString } from 'class-validator';
import { Role } from '../types/role';

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  role: Role;
}
