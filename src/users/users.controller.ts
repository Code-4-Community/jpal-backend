import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './types/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    description: 'Creates a new User.',
  })
  @ApiConflictResponse({
    description: 'User with given email already exists',
    type: ConflictException,
  })
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body.email, body.role, body.password);
  }
}
