import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Role } from '../src/users/types/role';
import { User } from '../src/users/types/user.entity';
import { overrideExternalDependencies } from './mockProviders';

const initialResearcherUser: Omit<User, 'id'> = {
  email: 'test@test.com',
  role: Role.RESEARCHER,
};

const adminUser1: Omit<User, 'id'> = {
  email: 'cooladmin@test.com',
  role: Role.ADMIN,
};

const adminUser2: Omit<User, 'id'> = {
  email: 'lameadmin@test.com',
  role: Role.ADMIN,
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

  });

  beforeEach(async () => {
    await usersRepository.clear();
    await usersRepository.save([initialResearcherUser, adminUser1, adminUser2]);
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
      }),
    );
  });

  it('should get all admins', async () => {
    expect.assertions(3);
    const response = await request(app.getHttpServer())
    .get('/users')
    .set(
      'Authorization',
      `Bearer ${JSON.stringify({ email: 'test@test.com' })}`,
    );

    expect(await usersRepository.find()).toEqual([initialResearcherUser, adminUser1, adminUser2]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      [expect.objectContaining(adminUser1), expect.objectContaining(adminUser2)])
  });

  afterAll(async () => await app.close());
});
