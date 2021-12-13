import { Body, Controller, Post, Get } from '@nestjs/common';
import { Role } from './types/role';
import { User } from './types/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Must be authenticated as researcher. Creates a User with the given email and role.
   */
  @Post()
  @Auth(Role.RESEARCHER)
  create(@Body() createUserRequestDto: CreateUserRequestDto): Promise<User> {
    return this.userService.create(createUserRequestDto.email, createUserRequestDto.role);
  }

  /**
   * Returns all the users with the admin role.
   */
  @Get()
  @Auth(Role.RESEARCHER)
  getAllAdmins(): Promise<User[]> {
    return this.userService.getAllAdmins();
  }
}
