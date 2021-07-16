import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import {
  ApiAcceptedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../users/types/user.entity';
import { Roles } from '../users/types/roles';
import { ReqUser } from './decorators/user.decorator';
import { Auth } from './decorators/auth.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @ApiOperation({
    description:
      'Logs in with a correct email and password. Returns the user and token for' +
      ' accessing protected routes.',
  })
  @ApiNotFoundResponse({
    description: 'User with given email does not exist',
  })
  @ApiUnauthorizedResponse({
    description: 'Password mismatch',
  })
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.logIn(body.email, body.password);
  }

  @Get('me')
  @Auth(Roles.ADMIN, Roles.RESEARCHER)
  @ApiOperation({
    description: 'Must be authenticated. Returns the User making the request.',
  })
  @ApiAcceptedResponse({
    type: User,
  })
  me(@ReqUser() user: User): User {
    return user;
  }
}
