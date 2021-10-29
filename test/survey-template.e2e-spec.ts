import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Role } from '../src/user/types/role';
import { User } from '../src/user/types/user.entity';
import { overrideExternalDependencies } from './mockProviders';
import { clearDb } from './e2e.utils';
import { SurveyTemplate } from "../src/surveyTemplate/types/surveyTemplate.entity";

const user: User = {
  id: 1,
  email: 'cooladmin@test.com',
  role: Role.ADMIN,
};

const surveyTemplate: SurveyTemplate = {
  id: 1,
  creator: user,
  questions: [],
}

describe('Survey Template e2e', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let surveyTemplateRepository: Repository<SurveyTemplate>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await overrideExternalDependencies(
      Test.createTestingModule({
        imports: [AppModule],
      }),
    ).compile();

    usersRepository = moduleFixture.get('UserRepository');
    surveyTemplateRepository = moduleFixture.get('SurveyTemplateRepository');

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    await clearDb();
    await usersRepository.save([user]);
    await surveyTemplateRepository.save([surveyTemplate]);
  });

  it('should error when requesting survey template that does not exist', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/survey-template/-1');

    expect(response.statusCode).toBe(400);
  });

  it('should error when requesting survey template that does not exist', async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer()).get('/survey-template/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(surveyTemplate);
  });

  afterAll(async () => await app.close());
});
