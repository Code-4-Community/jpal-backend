import { User } from '../../users/types/user.entity';

export interface LoginResponseDto {
  user: User;
  jwt: string;
}
