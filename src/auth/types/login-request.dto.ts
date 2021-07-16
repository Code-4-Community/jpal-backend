import { IsEmail, MinLength } from 'class-validator';

export class LoginRequestDto {
  /**
   * A valid email address.
   * @example "jung.ry@northeastern.edu"
   */
  @IsEmail()
  email: string;

  /**
   * A valid password.
   * @example "password123"
   */
  @MinLength(8)
  password: string;
}
