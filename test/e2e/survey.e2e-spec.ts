import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Survey } from '../../src/survey/types/survey.entity';
import { Repository } from 'typeorm';
import { clearDb } from '../e2e.utils';
import { overrideExternalDependencies } from '../mockProviders';
import { mockUser } from '../../src/user/user.service.spec';
import { mockSurveyTemplate } from '../../src/survey/survey.service.spec';
import { User } from '../../src/user/types/user.entity';
import { SurveyTemplate } from '../../src/surveyTemplate/types/surveyTemplate.entity';
import { Role } from '../../src/user/types/role';

const UUID = '123e4567-e89b-12d3-a456-426614174000';
const UUID2 = 'a48bea54-4948-4f38-897e-f47a042c891d';

const mockUser2: User = {
  id: 2,
  email: 'something@test.com',
  firstName: 'first',
  lastName: 'last',
  role: Role.RESEARCHER,
};

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
    const user2 = await userRepository.save(mockUser2);

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
    await surveyRepository.save({
      name: 'My survey',
      creator: user2,
      uuid: UUID2,
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

    expect(response.body).toEqual([expected]);
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
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });

  it('should return the survey by another uuid', async () => {
    const response = await request(app.getHttpServer())
      .get(`/survey/${UUID2}`)
      .set(
        'Authorization',
        `Bearer ${JSON.stringify({ email: 'something@test.com' })}`,
      );

    const expected = new Survey();
    expected.id = 2;
    expected.name = 'My survey';
    expected.uuid = UUID2;
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });

  it('should return a 400 when the uuid is invalid', async () => {
    const response = await request(app.getHttpServer())
      .get(`/survey/invalid-uuid`)
      .set(
        'Authorization',
        `Bearer ${JSON.stringify({ email: 'something@test.com' })}`,
      );
    expect(response.statusCode).toBe(400);
  });

  afterAll(async () => await app.close());
});
