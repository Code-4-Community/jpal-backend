import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/types/user.entity';
import { MockRepository } from './db/MockRepository';
import { Roles } from '../src/users/types/roles';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const UserRepository = new MockRepository<User>();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(UserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  test('POST /users', async () => {
    const user: Omit<User, 'id'> = {
      email: 'test@test.com',
      role: Roles.ADMIN,
      password: 'testpassword',
    };
    await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBe(1);
        expect(body.email).toBe(user.email);
        expect(body.password === user.password).toBe(false);
      });
  });

  afterAll(() => {
    app.close();
  });
});
