import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './types/user.entity';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    description: 'Creates a new User.',
  })
  @ApiCreatedResponse({
    type: User,
  })
  @ApiConflictResponse({
    description: 'User with given email already exists',
  })
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body.email, body.role, body.password);
  }
}
