import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';
import { BcryptWrapper } from './bcrypt.wrapper';

const mockBcryptWrapper: BcryptWrapper = {
  hashSync(data: string | Buffer, saltOrRounds: string | number): string {
    return `HASHED${data}`;
  },
  compareSync(data: string | Buffer, encrypted: string): boolean {
    return encrypted === `HASHED${data}`;
  },
};

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BcryptService,
        {
          provide: BcryptWrapper,
          useValue: mockBcryptWrapper,
        },
      ],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  test('hash', () => {
    expect(service.hash('test') === 'test').toBe(false);
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
