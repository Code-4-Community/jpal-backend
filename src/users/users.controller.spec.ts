import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { Role } from './types/role';
import { UsersService } from './users.service';
import { User } from './types/user.entity';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  role: Role.ADMIN,
  isClaimed: true,
};

const serviceMock: Partial<UsersService> = {
  create: jest.fn((email: string, role: Role) => Promise.resolve(mockUser)),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  test('create', async () => {
    expect(
      await controller.create({ email: mockUser.email, role: mockUser.role }),
    ).toEqual(mockUser);
    expect(serviceMock.create).toHaveBeenCalledWith(mockUser.email, mockUser.role);
  });
});
