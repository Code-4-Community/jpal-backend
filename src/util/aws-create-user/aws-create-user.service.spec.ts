import { Test, TestingModule } from '@nestjs/testing';
import * as AWS from 'aws-sdk';
import { AwsCreateUserService } from './aws-create-user.service';
import { AwsCreateUserServiceWrapper } from './aws-create-user.wrapper';
jest.mock('aws-sdk');

const adminCreateUserSpy = jest.fn();
const mockAwsCreateUserServiceWrapper: AwsCreateUserServiceWrapper = {
  configureAws: () => {
    return;
  },

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
    expect(service).toBeDefined();
  });

  it('should call the right AWS API endpoint', async () => {
    adminCreateUserSpy.mockImplementation((_pool, callback) => {
      return callback(null, {});
    });
    await service.adminCreateUser('blier.o@northeastern.edu');
    expect(adminCreateUserSpy).toHaveBeenCalled();
  });
});
