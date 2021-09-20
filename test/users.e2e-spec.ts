import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Role } from '../src/users/types/role';
import { User } from '../src/users/types/user.entity';
import { overrideExternalDependencies } from './mockProviders';

const initialAdminUser: Omit<User, 'id'> = {
  email: 'test@test.com',
  role: Role.RESEARCHER,
  isClaimed: true,
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
    await usersRepository.clear();
    await usersRepository.save(initialAdminUser);
  });

  beforeEach(async () => {
    await usersRepository.clear();
    await usersRepository.save(initialAdminUser);
  });

  it('should save a user when creating a researcher user', async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer())
      .post('/users')
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
        isClaimed: false,
      }),
    );
  });

  it('should save a user when creating an admin user', async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer())
      .post('/users')
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
        isClaimed: false,
      }),
    );
  });

  afterAll(async () => await app.close());
});
