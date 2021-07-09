import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  test('hash', () => {
    expect(service.hash('test') === 'test').toBe(false);
    expect(service.hash('password1') === service.hash('password1')).toBe(false);
    expect(typeof service.hash('example')).toBe('string');
    expect(() => {
      service.hash('');
    }).toThrow();
  });

  test('compare', () => {
    const hashed = service.hash('pass123456');
    expect(service.compare('pass123456', hashed)).toBe(true);
    expect(service.compare('pass12345', hashed)).toBe(false);
    expect(() => {
      service.compare('24g08jv90j8', '');
    }).toThrow();
    expect(() => {
      service.compare('', 'wfouj2wovh');
    }).toThrow();
  });
});
