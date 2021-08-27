import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './types/user.entity';
import { Roles } from './types/roles';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  role: Roles.ADMIN,
  isClaimed: false,
};

const mockUserRepository: Partial<Repository<User>> = {
  create(user?: DeepPartial<User> | DeepPartial<User>[]): any {
    return {
      id: 1,
      ...user,
    };
  },
  save<T>(user): T {
    return user;
  },
  findOne(user: any): any {
    if ((user as User).email === 'already@exists.com') return mockUser;
    return undefined;
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  test('create', async () => {
    await expect(
      service.create('already@exists.com', mockUser.role),
    ).rejects.toThrow(new ConflictException('Email already exists'));

    const goodResponse = await service.create(mockUser.email, mockUser.role);
    expect(goodResponse).toEqual({
      id: 1,
      email: mockUser.email,
      role: mockUser.role,
    });
  });
});
