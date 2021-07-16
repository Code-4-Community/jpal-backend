import { Roles } from '../types/roles';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsEnum(Roles)
  @ApiProperty({
    enum: Roles,
  })
  role: Roles;

  @IsNotEmpty()
  @ApiProperty({
    minLength: 8,
  })
  password: string;
}
