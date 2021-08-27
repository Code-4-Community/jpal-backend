import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Roles } from '../src/users/types/roles';
import { User } from '../src/users/types/user.entity';

const initialUser: Omit<User, 'id'> = {
  email: 'test@test.com',
  role: Roles.ADMIN,
  isClaimed: false,
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const users = moduleFixture.get('UserRepository');

    app = moduleFixture.createNestApplication();

    await app.init();

    await users.clear();
    await users.save(initialUser);
  });

  test('POST /auth/', async () => {
    await request(app.getHttpServer())
      .post('/auth')
      .send({
        email: 'test@test.com',
        password: 'testpassword123',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.jwt).toBeDefined();
        expect(body.user.email).toBe(initialUser.email);
      });
  });
  afterAll(async () => await app.close());
});
