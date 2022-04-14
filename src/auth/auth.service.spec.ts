import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../user/types/role';
import { User } from '../user/types/user.entity';
import { CognitoService } from '../util/cognito/cognito.service';
import { AuthService } from './auth.service';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  firstName: 'first',
  lastName: 'last',
  creation_date: new Date("2-6'2022"),
  role: Role.RESEARCHER,
};

const mockCognitoService = {
  validate: jest.fn(),
};

const repositoryMock: Partial<Repository<User>> = {
  findOne: jest.fn(async () => {
    return mockUser;
  }),
  findOneOrFail: jest.fn(async () => {
    return mockUser;
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
        {
          provide: CognitoService,
          useValue: mockCognitoService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  test('verifyJwt', async () => {
    mockCognitoService.validate.mockRejectedValueOnce(new UnauthorizedException());

    await expect(service.verifyJwt('5')).rejects.toThrow(new UnauthorizedException());
    expect(mockCognitoService.validate).toHaveBeenCalledTimes(1);

    mockCognitoService.validate.mockResolvedValueOnce(mockUser);
    const goodResponse = await service.verifyJwt('whatever');
    expect(goodResponse).toEqual(mockUser);
    expect(mockCognitoService.validate).toHaveBeenCalledTimes(2);
  });
});
