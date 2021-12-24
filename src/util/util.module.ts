import { Module } from '@nestjs/common';
import { AwsCreateUserService } from './aws-create-user/aws-create-user.service';
import { AwsCreateUserServiceWrapper } from './aws-create-user/aws-create-user.wrapper';
import { CognitoService } from './cognito/cognito.service';
import { CognitoWrapper } from './cognito/cognito.wrapper';
import { amazonSESClientFactory } from './email/amazon-ses-client.factory';
import { AmazonSESWrapper } from './email/amazon-ses.wrapper';
import { EmailService } from './email/email.service';

@Module({
  providers: [
    CognitoService,
    AwsCreateUserService,
    EmailService,
    amazonSESClientFactory,
    AmazonSESWrapper,
    AwsCreateUserServiceWrapper,
    CognitoWrapper,
  ],
  exports: [EmailService, CognitoService, AwsCreateUserService],
})
export class UtilModule {}
