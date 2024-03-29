import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { Role } from '../../src/user/types/role';
import { User } from '../../src/user/types/user.entity';
import { overrideExternalDependencies } from '../mockProviders';
import { clearDb } from '../e2e.utils';

const initialResearcherUser: Omit<User, 'id'> = {
  email: 'test@test.com',
  firstName: 'test',
  lastName: 'researcher',
  role: Role.RESEARCHER,
  createdDate: new Date('2023-09-28'),
};

const adminUser1: Omit<User, 'id'> = {
  email: 'cooladmin@test.com',
  firstName: 'test',
  lastName: 'admin1',
  role: Role.ADMIN,
  createdDate: new Date('2023-09-28'),
};

const adminUser2: Omit<User, 'id'> = {
  email: 'lameadmin@test.com',
  firstName: 'test',
  lastName: 'admin2',
  role: Role.ADMIN,
  createdDate: new Date('2023-09-28'),
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
    await clearDb();
    await usersRepository.save([initialResearcherUser, adminUser1, adminUser2]);
  });

  it('should save a user when creating a researcher user', async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer())
      .post('/user')
      .send({
        email: 'test.createuser@test.com',
        firstName: 'test2',
        lastName: 'researcher',
        role: Role.RESEARCHER,
      })
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'test@test.com' })}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: 'test.createuser@test.com',
        firstName: 'test2',
        lastName: 'researcher',
        role: Role.RESEARCHER,
      }),
    );
  });

  it('should save a user when creating an admin user', async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer())
      .post('/user')
      .send({
        email: 'test.createuser@test.com',
        firstName: 'test2',
        lastName: 'admin',
        role: Role.ADMIN,
      })
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'test@test.com' })}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: 'test.createuser@test.com',
        firstName: 'test2',
        lastName: 'admin',
        role: Role.ADMIN,
      }),
    );
  });

  it('should get all admins', async () => {
    expect.assertions(3);
    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'test@test.com' })}`);

    expect(await usersRepository.find()).toEqual([initialResearcherUser, adminUser1, adminUser2]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        email: 'cooladmin@test.com',
        firstName: 'test',
        lastName: 'admin1',
        role: Role.ADMIN,
        createdDate: new Date('2023-09-28').toISOString(),
      }),
      expect.objectContaining({
        email: 'lameadmin@test.com',
        firstName: 'test',
        lastName: 'admin2',
        role: Role.ADMIN,
        createdDate: new Date('2023-09-28').toISOString(),
      }),
    ]);
  });

  afterAll(async () => await app.close());
});
