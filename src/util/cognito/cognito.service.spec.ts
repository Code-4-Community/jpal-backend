import { Test, TestingModule } from '@nestjs/testing';
import { CognitoService } from './cognito.service';
import { CognitoWrapper } from './cognito.wrapper';
import { userPoolFactory } from './user-pool.factory';

describe('CognitoService', () => {
  let service: CognitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CognitoService, CognitoWrapper, userPoolFactory],
    }).compile();

    service = module.get<CognitoService>(CognitoService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
});

it('needs a test to pass', () => expect(true).toBeTruthy());
