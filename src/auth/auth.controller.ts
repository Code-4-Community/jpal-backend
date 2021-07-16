import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../users/types/roles';
import { User } from '../users/types/user.entity';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { ReqUser } from './decorators/user.decorator';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Logs in with a correct email and password. Returns the user and token for
   * accessing protected routes.
   */
  @Post()
  @ApiBadRequestResponse({
    description: 'Invalid email or password',
  })
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.logIn(body.email, body.password);
  }

  /**
   * Must be authenticated. Returns the User making the request.
   */
  @Get('me')
  @Auth(Roles.ADMIN, Roles.RESEARCHER)
  me(@ReqUser() user: User): User {
    return user;
  }
}
