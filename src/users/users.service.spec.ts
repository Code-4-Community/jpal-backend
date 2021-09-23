import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';
import { DeepPartial, Repository } from 'typeorm';
import { AwsCreateUserService } from '../../src/util/aws-create-user/aws-create-user.service';
import { Role } from './types/role';
import { User } from './types/user.entity';
import { UsersService } from './users.service';
const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  role: Role.ADMIN,
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

const mockAwsCreateUserService = mock<AwsCreateUserService>();

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
        {
          provide: AwsCreateUserService,
          useValue: mockAwsCreateUserService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should fail to create a user whose email is already claimed', async () => {
    await expect(
      service.create('already@exists.com', mockUser.role),
    ).rejects.toThrow(new ConflictException('Email already exists'));
  });
  it('should create a fresh unclaimed user', async () => {
    const goodResponse = await service.create(mockUser.email, mockUser.role);
    expect(goodResponse).toEqual({
      id: 1,
      email: mockUser.email,
      role: mockUser.role,
      isClaimed: false,
    });
    expect(mockAwsCreateUserService.adminCreateUser).toHaveBeenCalledWith(
      mockUser.email,
    );
  });
});
