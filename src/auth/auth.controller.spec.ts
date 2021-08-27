import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/types/user.entity';
import { Roles } from '../users/types/roles';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  role: Roles.ADMIN,
  isClaimed: true,
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
