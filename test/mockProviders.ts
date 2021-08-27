import { TestingModuleBuilder } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import * as mailgun from 'mailgun-js';
import { AwsCreateUserService } from '../src/util/aws-create-user/aws-create-user.service';
import { AwsCreateUserServiceWrapper } from '../src/util/aws-create-user/aws-create-user.wrapper';
import { CognitoService } from '../src/util/cognito/cognito.service';
import { CognitoWrapper } from '../src/util/cognito/cognito.wrapper';
import { EmailService } from '../src/util/email/email.service';
import { MAILGUN_CLIENT } from '../src/util/email/mailgun-client.factory';
import { MailgunWrapper } from '../src/util/email/mailgun.wrapper';

/**
 * Mock out any external IO dependencies so we can ignore third party API calls in our E2E tests.
 * For example, we don't want to send actual emails in our E2E tests, we just want to check that the service is called.
 */
export const overrideExternalDependencies = (
  testingModule: TestingModuleBuilder,
): TestingModuleBuilder => {
  return testingModule
    .overrideProvider(EmailService)
    .useValue(mock<EmailService>())
    .overrideProvider(MailgunWrapper)
    .useValue(mock<MailgunWrapper>())
    .overrideProvider(MAILGUN_CLIENT)
    .useValue(mock<mailgun.Mailgun>())
    .overrideProvider(CognitoService)
    .useValue(mock<CognitoService>())
    .overrideProvider(CognitoWrapper)
    .useValue(mock<CognitoWrapper>())
    .overrideProvider(AwsCreateUserService)
    .useValue(mock<AwsCreateUserService>())
    .overrideProvider(AwsCreateUserServiceWrapper)
    .useValue(mock<AwsCreateUserServiceWrapper>());
};
