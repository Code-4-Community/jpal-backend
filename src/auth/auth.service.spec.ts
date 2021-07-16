import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../users/types/user.entity';
import { Roles } from '../users/types/roles';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptService } from '../util/bcrypt/bcrypt.service';
import { JwtService } from '../util/jwt/jwt.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  role: Roles.RESEARCHER,
  password: 'password123',
};

const repositoryMock: Partial<Repository<User>> = {
  findOne: jest.fn(async (cond: any) => {
    if (cond.email === mockUser.email) return mockUser;
    return undefined;
  }),
  findOneOrFail: jest.fn(async (cond: any) => {
    if (cond.id === 1) return mockUser;
    throw new Error();
  }),
};

const bcryptMock: Partial<BcryptService> = {
  compare(raw: string, hashed: string): boolean {
    return raw === hashed;
  },
};

const jwtMock: Partial<JwtService> = {
  sign(userId: number): string {
    return userId.toString();
  },
  verify(jwt: string): number {
    return Number(jwt);
  },
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
          provide: BcryptService,
          useValue: bcryptMock,
        },
        {
          provide: JwtService,
          useValue: jwtMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  test('login', async () => {
    await expect(
      service.logIn('nonexistent@email.com', 'anypassword'),
    ).rejects.toThrow(new NotFoundException('User not found'));

    await expect(
      service.logIn(mockUser.email, 'wrongpassword'),
    ).rejects.toThrow(new UnauthorizedException('Password mismatch'));

    const goodResponse = await service.logIn(mockUser.email, mockUser.password);
    expect(goodResponse.user).toBe(mockUser);
    expect(goodResponse.jwt).toBe(mockUser.id.toString());
  });

  test('verifyJwt', async () => {
    await expect(service.verifyJwt('5')).rejects.toThrow(
      new UnauthorizedException(),
    );

    await expect(service.verifyJwt('0')).rejects.toThrow(
      new UnauthorizedException(),
    );

    const goodResponse = await service.verifyJwt(mockUser.id.toString());
    expect(goodResponse).toEqual(mockUser);
  });
});
