import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { JwtWrapper } from './jwt.wrapper';
import { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { JwtPayload } from './types/jwt-payload';

const mockJwtWrapper: JwtWrapper = {
  sign(payload: JwtPayload, options?: SignOptions): string {
    const customJwt = {
      payload,
      options,
    };
    return JSON.stringify(customJwt);
  },
  verify(token: string, options?: VerifyOptions): JwtPayload {
    const customJwt = JSON.parse(token);
    if (!customJwt || !customJwt.payload) throw new Error();
    return customJwt.payload as JwtPayload;
  },
};

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: JwtWrapper,
          useValue: mockJwtWrapper,
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  test('sign', () => {
    expect(typeof service.sign(5)).toEqual('string');
    expect(() => {
      service.sign(undefined);
    }).toThrow();
  });

  test('verify', () => {
    expect(() => {
      service.verify('');
    }).toThrow();
    const jwt = service.sign(3);
    expect(service.verify(jwt)).toBe(3);
  });
});
