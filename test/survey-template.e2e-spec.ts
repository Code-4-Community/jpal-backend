import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/types/user.entity';
import { overrideExternalDependencies } from './mockProviders';
import { clearDb } from './e2e.utils';
import { SurveyTemplate } from '../src/surveyTemplate/types/surveyTemplate.entity';
import { mockUser } from '../src/user/user.service.spec';
import { mockSurveyTemplate } from '../src/survey/survey.controller.spec';

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
    await usersRepository.save(mockUser);

    await surveyTemplateRepository.save(mockSurveyTemplate);
  });

  it('should error when requesting survey template that does not exist', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer())
      .get('/survey-template/123')
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'test@test.com' })}`);

    expect(response.statusCode).toBe(400);
  });

  it('should return correct survey template when it exists', async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer())
      .get(`/survey-template/${mockSurveyTemplate.id}`)
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'test@test.com' })}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: mockSurveyTemplate.id,
      }),
    );
  });

  afterAll(async () => await app.close());
});
