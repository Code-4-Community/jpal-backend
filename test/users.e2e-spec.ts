import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Role } from '../src/user/types/role';
import { User } from '../src/user/types/user.entity';
import { overrideExternalDependencies } from './mockProviders';
import { clearDb } from './e2e.utils';

const initialAdminUser: Omit<User, 'id'> = {
  email: 'test@test.com',
  role: Role.RESEARCHER,
};

describe('Users e2e', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await overrideExternalDependencies(
      Test.createTestingModule({
        imports: [AppModule],
      }),
    ).compile();

    usersRepository = moduleFixture.get('UserRepository');

    app = moduleFixture.createNestApplication();

    await app.init();
    await clearDb();
    await usersRepository.save(initialAdminUser);
  });

  beforeEach(async () => {
    await clearDb();
    await usersRepository.save(initialAdminUser);
  });

  it('should save a user when creating a researcher user', async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer())
      .post('/user')
      .send({ email: 'test.createuser@test.com', role: Role.RESEARCHER })
      .set(
        'Authorization',
        `Bearer ${JSON.stringify({ email: 'test@test.com' })}`,
      );

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: 'test.createuser@test.com',
        role: Role.RESEARCHER,
      }),
    );
  });

  it('should save a user when creating an admin user', async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer())
      .post('/user')
      .send({ email: 'test.createuser@test.com', role: Role.ADMIN })
      .set(
        'Authorization',
        `Bearer ${JSON.stringify({ email: 'test@test.com' })}`,
      );

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: 'test.createuser@test.com',
        role: Role.ADMIN,
      }),
    );
  });

  afterAll(async () => await app.close());
});
