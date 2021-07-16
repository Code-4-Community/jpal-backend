import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoleGuard } from './guards/auth.guard';
import { Roles } from '../users/types/roles';
import { LoginRequestDto } from './types/login-request.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginRequestDto) {
    return await this.authService.logIn(body.email, body.password);
  }
}
