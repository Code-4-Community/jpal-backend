import { User } from '../../users/types/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    type: User,
  })
  user: User;

  @ApiProperty({
    description: 'The jason web token generated for the user',
  })
  jwt: string;
}
