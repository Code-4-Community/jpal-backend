import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/types/user.entity';
import { MockRepository } from './db/MockRepository';
import { Roles } from '../src/users/types/roles';
import { AuthModule } from '../src/auth/auth.module';
import * as Bcrypt from 'bcrypt';
import { AuthenticationMiddleware } from '../src/auth/middleware/authentication.middleware';
import { AuthService } from '../src/auth/auth.service';

const initialUser: Omit<User, 'id'> = {
  email: 'test@test.com',
  role: Roles.ADMIN,
  password: Bcrypt.hashSync('testpassword123', 10),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const UserRepository = new MockRepository<User>([initialUser]);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(UserRepository)
      .compile();

    const compiledAuthService = moduleFixture.get(AuthService);

    app = moduleFixture.createNestApplication();
    app.use(
      new AuthenticationMiddleware(compiledAuthService).use.bind({
        authService: compiledAuthService,
      }),
    );
    await app.init();
  });

  test('POST /auth', async () => {
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

    await request(app.getHttpServer())
      .post('/auth')
      .send({
        email: 'test1@test.com',
        password: 'testpassword123',
      })
      .expect(404);

    await request(app.getHttpServer())
      .post('/auth')
      .send({
        email: 'test@test.com',
        password: 'testpassword1234',
      })
      .expect(401);
  });

  test('GET /me', async () => {
    const { body } = await request(app.getHttpServer()).post('/auth').send({
      email: 'test@test.com',
      password: 'testpassword123',
    });
    const token = body.jwt;

    expect(token).toBeDefined();

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.email).toBe(initialUser.email);
      });

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer`)
      .expect(403);

    await request(app.getHttpServer()).get('/auth/me').expect(403);
  });

  afterAll(() => {
    app.close();
  });
});
