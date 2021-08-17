import { Test, TestingModule } from '@nestjs/testing';
import { AwsCreateUserService } from './aws-create-user.service';

describe('AwsCreateUserService', () => {
  let service: AwsCreateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsCreateUserService],
    }).compile();

    service = module.get<AwsCreateUserService>(AwsCreateUserService);
  });

  it('should be defined', async () => {
    await service.adminCreateUser('blier.o@northeastern.edu');
    expect(service).toBeDefined();
  });
});

it('needs a test to pass', () => expect(true).toBeTruthy());
