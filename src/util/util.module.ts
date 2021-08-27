import { Module } from '@nestjs/common';
import { AwsCreateUserService } from './aws-create-user/aws-create-user.service';
import { AwsCreateUserServiceWrapper } from './aws-create-user/aws-create-user.wrapper';
import { CognitoService } from './cognito/cognito.service';
import { CognitoWrapper } from './cognito/cognito.wrapper';
import { EmailService } from './email/email.service';
import { mailgunClientFactory } from './email/mailgun-client.factory';
import { MailgunWrapper } from './email/mailgun.wrapper';

@Module({
  providers: [
    CognitoService,
    AwsCreateUserService,
    EmailService,
    mailgunClientFactory,
    MailgunWrapper,
    AwsCreateUserServiceWrapper,
    CognitoWrapper,
  ],
  exports: [EmailService, CognitoService, AwsCreateUserService],
})
export class UtilModule {}
