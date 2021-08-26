import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { JwtService } from './jwt/jwt.service';
import { BcryptWrapper } from './bcrypt/bcrypt.wrapper';
import { JwtWrapper } from './jwt/jwt.wrapper';
import { MailgunWrapper } from './email/mailgun.wrapper';
import { mailgunClientFactory } from './email/mailgun-client.factory';
import { AwsCreateUserServiceWrapper } from './aws-create-user/aws-create-user.wrapper';
import { AwsCreateUserService } from './aws-create-user/aws-create-user.service';
import { CognitoService } from './cognito/cognito.service';

@Module({
  providers: [
    BcryptService,
    JwtService,
    CognitoService,
    AwsCreateUserService,
    BcryptWrapper,
    EmailService,
    mailgunClientFactory,
    MailgunWrapper,
    JwtWrapper,
    AwsCreateUserServiceWrapper,
  ],
  exports: [
    BcryptService,
    JwtService,
    EmailService,
    CognitoService,
    AwsCreateUserService,
  ],
})
export class UtilModule {}
