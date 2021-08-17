import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { JwtService } from './jwt/jwt.service';
import { BcryptWrapper } from './bcrypt/bcrypt.wrapper';
import { JwtWrapper } from './jwt/jwt.wrapper';
import { MailgunWrapper } from './email/mailgun.wrapper';
import { mailgunClientFactory } from './email/mailgun-client.factory';

@Module({
  providers: [
    BcryptService,
    JwtService,
    BcryptWrapper,
    EmailService,
    mailgunClientFactory,
    MailgunWrapper,
    JwtWrapper,
  ],
  exports: [BcryptService, JwtService, EmailService],
})
export class UtilModule {}
