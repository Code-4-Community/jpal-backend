import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { BcryptService } from './bcrypt/bcrypt.service';

@Module({
  providers: [EmailService, BcryptService],
  exports: [EmailService, BcryptService],
})
export class UtilModule {}
