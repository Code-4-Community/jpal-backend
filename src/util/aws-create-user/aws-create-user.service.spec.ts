import { Test, TestingModule } from '@nestjs/testing';
import { AwsCreateUserService } from './aws-create-user.service';
import * as AWS from 'aws-sdk';
import { AwsCreateUserServiceWrapper } from './aws-create-user.wrapper';
jest.mock('aws-sdk');

const adminCreateUserSpy = jest.fn();
const mockAwsCreateUserServiceWrapper: AwsCreateUserServiceWrapper = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configureAws: () => {},

  instantiateCognitoClient: () =>
    ({
      adminCreateUser: adminCreateUserSpy,
    } as unknown as AWS.CognitoIdentityServiceProvider),
};

describe('AwsCreateUserService', () => {
  let service: AwsCreateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsCreateUserService,
        {
          provide: AwsCreateUserServiceWrapper,
          useValue: mockAwsCreateUserServiceWrapper,
        },
      ],
    }).compile();

    service = module.get<AwsCreateUserService>(AwsCreateUserService);
  });

  it('should be defined', async () => {
    // await service.adminCreateUser('blier.o@northeastern.edu');
    expect(service).toBeDefined();
  });

  it('should call the right AWS API endpoint', async () => {
    await service.adminCreateUser('blier.o@northeastern.edu');
    expect(adminCreateUserSpy).toHaveBeenCalled();
  });
});

it('needs a test to pass', () => expect(true).toBeTruthy());
