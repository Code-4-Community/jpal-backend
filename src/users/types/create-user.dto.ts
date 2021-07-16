import { IsEmail, MinLength } from 'class-validator';
import { Roles } from './roles';
import { User } from './user.entity';

class CreateUserDto implements Omit<User, 'id'> {
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
  role: Roles;
}

export default CreateUserDto;
