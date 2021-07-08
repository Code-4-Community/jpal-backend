import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './types/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.role, body.password);
  }
}
