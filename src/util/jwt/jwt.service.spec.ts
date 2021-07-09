import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService],
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
