import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './types/user.entity';
import { Roles } from './types/roles';

const mockUsersService: Partial<UsersService> = {
  async create(email: string, role: Roles, password: string): Promise<User> {
    return {
      id: 1,
      email,
      role,
      password,
    };
  },
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  test('createUser', async () => {
    const user = {
      email: 'test@test.com',
      role: Roles.ADMIN,
      password: 'testpass',
    };
    const response = await controller.createUser(user);
    expect(response).toEqual({
      id: 1,
      ...user,
    });
  });
});
