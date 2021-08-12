import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './types/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body.email, body.role, body.password);
  }
}
