import { Body, Controller, Post, Get } from '@nestjs/common';
import { Role } from '../users/types/role';
import { User } from '../users/types/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Must be authenticated as researcher. Creates a User with the given email and role.
   */
  @Post()
  @Auth(Role.RESEARCHER)
  create(@Body() createUserRequestDto: CreateUserRequestDto): Promise<User> {
    return this.usersService.create(
      createUserRequestDto.email,
      createUserRequestDto.role,
    );
  }
  
  /**
   * Returns all the users with the admin role.
   */
  @Get()
  @Auth(Role.RESEARCHER)
  getAllAdmins() : Promise<User[]> {
    return this.usersService.getAllAdmins();
  }

  
  

}
