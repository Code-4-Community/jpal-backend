import { Test, TestingModule } from '@nestjs/testing';
import { CognitoService } from './cognito.service';
import { CognitoWrapper } from './cognito.wrapper';

const mockCognitoWrapper = {
  validate: jest.fn(),
};

describe('CognitoService', () => {
  let service: CognitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CognitoService,
        {
          provide: CognitoWrapper,
          useValue: mockCognitoWrapper,
        },
      ],
    }).compile();

    service = module.get<CognitoService>(CognitoService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should call cognito validation wrapper with token', async () => {
    const myToken = 'someJWT';
    await service.validate(myToken);
    expect(mockCognitoWrapper.validate).toHaveBeenCalledWith(myToken);
  });
});
