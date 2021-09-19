import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../types/role';


export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  role: Role;
}
