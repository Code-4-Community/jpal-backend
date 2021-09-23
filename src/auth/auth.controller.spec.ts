import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/types/user.entity';
import { Role } from '../users/types/role';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  role: Role.ADMIN,
};

const serviceMock: Partial<AuthService> = {
  verifyJwt: () => Promise.resolve(mockUser),
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

  test('me', () => {
    expect(controller.me(mockUser)).toEqual(mockUser);
  });
});
