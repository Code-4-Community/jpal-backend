import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Role } from '../src/users/types/role';
import { User } from '../src/users/types/user.entity';
import { overrideExternalDependencies } from './mockProviders';

const initialUser: Omit<User, 'id'> = {
  email: 'test@test.com',
  role: Role.ADMIN,
};

describe('Example e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await overrideExternalDependencies(
      Test.createTestingModule({
        imports: [AppModule],
      }),
    ).compile();

    const users = moduleFixture.get('UserRepository');

    app = moduleFixture.createNestApplication();

    await app.init();

    await users.clear();
    await users.save(initialUser);
  });
  test('needs a test to pass', () => expect(true).toBe(true));

  afterAll(async () => await app.close());
});
