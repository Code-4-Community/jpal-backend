import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { JwtService } from './jwt/jwt.service';

@Module({
  providers: [EmailService, BcryptService, JwtService],
  exports: [EmailService, BcryptService, JwtService],
})
export class UtilModule {}
