import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { Roles } from '../users/types/roles';

const mockUser = {
  id: 1,
  email: 'test@test.com',
  password: 'password123',
  role: Roles.ADMIN,
};

const mockLoginResponse: LoginResponseDto = {
  user: mockUser,
  jwt: '40f8hj208cdj1df2',
};

const serviceMock: Partial<AuthService> = {
  async logIn(email: string, password: string): Promise<LoginResponseDto> {
    return mockLoginResponse;
  },
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  test('login', async () => {
    const goodResponse = await controller.login({
      email: mockLoginResponse.user.email,
      password: mockLoginResponse.user.password,
    });
    expect(goodResponse).toEqual(mockLoginResponse);
  });

  test('me', () => {
    expect(controller.me(mockUser)).toEqual(mockUser);
  });
});
