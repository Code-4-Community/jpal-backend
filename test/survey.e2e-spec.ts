import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Survey } from '../src/survey/types/survey.entity';
import { Repository } from 'typeorm';
import { clearDb } from './e2e.utils';
import { overrideExternalDependencies } from './mockProviders';
import { mockUser } from '../src/user/user.service.spec';
import { mockSurveyTemplate } from '../src/survey/survey.service.spec';
import { User } from '../src/user/types/user.entity';
import { SurveyTemplate } from '../src/surveyTemplate/types/surveyTemplate.entity';

const UUID = '123e4567-e89b-12d3-a456-426614174000';
describe('Survey e2e', () => {
  let app: INestApplication;
  let surveyRepository: Repository<Survey>;
  let userRepository: Repository<User>;
  let surveyTemplateRepository: Repository<SurveyTemplate>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await overrideExternalDependencies(
      Test.createTestingModule({
        imports: [AppModule],
      }),
    ).compile();

    userRepository = moduleFixture.get('UserRepository');
    surveyTemplateRepository = moduleFixture.get('SurveyTemplateRepository');
    surveyRepository = moduleFixture.get('SurveyRepository');

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    await clearDb();
    const user = await userRepository.save(mockUser);

    mockSurveyTemplate.creator = user;

    const surveyTemplate = await surveyTemplateRepository.save(
      mockSurveyTemplate,
    );
    await surveyRepository.save({
      name: "Joe's favorite survey",
      creator: user,
      uuid: UUID,
      surveyTemplate,
    });
  });

  it('should find all the surveys created by the user', async () => {
    const response = await request(app.getHttpServer())
      .get('/survey')
      .set(
        'Authorization',
        `Bearer ${JSON.stringify({ email: 'test@test.com' })}`,
      );

    const expected = new Survey();
    expected.id = 1;
    expected.name = "Joe's favorite survey";
    expected.uuid = UUID;

    expect(await surveyRepository.find()).toEqual([expected]);
    expect(response.statusCode).toBe(200);
  });

  it('should return the survey by the given uuid', async () => {
    const response = await request(app.getHttpServer())
      .get(`/survey/${UUID}`)
      .set(
        'Authorization',
        `Bearer ${JSON.stringify({ email: 'test@test.com' })}`,
      );

    const expected = new Survey();
    expected.id = 1;
    expected.name = "Joe's favorite survey";
    expected.uuid = UUID;
    expect(await surveyRepository.find()).toEqual([expected]);
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => await app.close());
});
