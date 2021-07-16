import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { JwtService } from './jwt/jwt.service';
import { CognitoService } from './cognito/cognito.service';
import { BcryptWrapper } from './bcrypt/bcrypt.wrapper';
import { JwtWrapper } from './jwt/jwt.wrapper';
import { CognitoWrapper } from './cognito/cognito.wrapper';
import { MailgunWrapper } from './email/mailgun.wrapper';
import { mailgunClientFactory } from './email/mailgun-client.factory';
import { userPoolFactory } from './cognito/user-pool.factory';

@Module({
  providers: [
    BcryptService,
    JwtService,
    CognitoService,
    userPoolFactory,
    CognitoWrapper,
    BcryptWrapper,
    EmailService,
    mailgunClientFactory,
    MailgunWrapper,
    JwtWrapper,
  ],
  exports: [BcryptService, JwtService, EmailService, CognitoService],
})
export class UtilModule {}
