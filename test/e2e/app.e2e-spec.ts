import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { Role } from '../../src/user/types/role';
import { User } from '../../src/user/types/user.entity';
import { clearDb } from '../e2e.utils';
import { overrideExternalDependencies } from '../mockProviders';

const initialUser: Omit<User, 'id'> = {
  email: 'test@test.com',
  firstName: 'first',
  lastName: 'last',
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

    await clearDb();
    await users.save(initialUser);
  });
  test('needs a test to pass', () => expect(true).toBe(true));

  afterAll(async () => await app.close());
});
