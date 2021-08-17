import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as Bcrypt from 'bcrypt';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Roles } from '../src/users/types/roles';
import { User } from '../src/users/types/user.entity';
import { MockSlackExceptionFilter } from './mock-slack-exception.filter';

const initialUser: Omit<User, 'id'> = {
  email: 'test@test.com',
  role: Roles.ADMIN,
  password: Bcrypt.hashSync('testpassword123', 10),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(APP_FILTER)
      .useClass(MockSlackExceptionFilter)
      .compile();

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
