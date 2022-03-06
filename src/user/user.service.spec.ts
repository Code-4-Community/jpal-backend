import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';
import { DeepPartial, Repository } from 'typeorm';
import { AwsCreateUserService } from '../util/aws-create-user/aws-create-user.service';
import { Role } from './types/role';
import { User } from './types/user.entity';
import { UserService } from './user.service';

export const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  firstName: 'William',
  lastName: 'user',
  role: Role.ADMIN,
};

export const mockResearcher: User = {
  id: 2,
  email: 'test@test.com',
  firstName: 'Paige',
  lastName: 'Turner',
  role: Role.RESEARCHER,
};

const listMockUsers: User[] = [mockUser, mockResearcher];

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
  find(): Promise<User[]> {
    return Promise.resolve(listMockUsers);
  },
};

const mockAwsCreateUserService = mock<AwsCreateUserService>();

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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

    service = module.get<UserService>(UserService);
  });

  it('should fail to create a user whose email is already claimed', async () => {
    await expect(
      service.create('already@exists.com', mockUser.firstName, mockUser.lastName, mockUser.role),
    ).rejects.toThrow(new ConflictException('Email already exists'));
  });

  it('should create a fresh unclaimed user', async () => {
    const goodResponse = await service.create(
      mockUser.email,
      mockUser.firstName,
      mockUser.lastName,
      mockUser.role,
    );
    expect(goodResponse).toEqual({
      id: 1,
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      role: mockUser.role,
    });
    expect(mockAwsCreateUserService.adminCreateUser).toHaveBeenCalledWith(mockUser.email);
  });

  it('should fetch all admins', async () => {
    const goodResponse = await service.getAllAdmins();
    expect.assertions(1);
    expect(goodResponse).toEqual(listMockUsers);
  });
});
