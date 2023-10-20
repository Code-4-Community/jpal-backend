import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Survey } from '../../src/survey/types/survey.entity';
import { Repository } from 'typeorm';
import { clearDb } from '../e2e.utils';
import { overrideExternalDependencies } from '../mockProviders';
import { mockUser } from '../../src/user/user.service.spec';
import { mockSurveyTemplate } from '../../src/survey/survey.controller.spec';
import { User } from '../../src/user/types/user.entity';
import { SurveyTemplate } from '../../src/surveyTemplate/types/surveyTemplate.entity';
import { Role } from '../../src/user/types/role';
import { Assignment } from '../../src/assignment/types/assignment.entity';
import { Youth } from '../../src/youth/types/youth.entity';
import { Reviewer } from '../../src/reviewer/types/reviewer.entity';
import { CreateBatchAssignmentsDto } from '../../src/survey/dto/create-batch-assignments.dto';
import { YouthRoles } from '../../src/youth/types/youthRoles';
import { AssignmentStatus } from '../../src/assignment/types/assignmentStatus';

const UUID = '123e4567-e89b-12d3-a456-426614174000';
const UUID2 = 'a48bea54-4948-4f38-897e-f47a042c891d';

const mockUser2: User = {
  id: 2,
  email: 'something@test.com',
  firstName: 'first',
  lastName: 'last',
  role: Role.RESEARCHER,
  createdDate: new Date('2023-09-28'),
};

describe('Survey e2e', () => {
  let app: INestApplication;
  let surveyRepository: Repository<Survey>;
  let userRepository: Repository<User>;
  let surveyTemplateRepository: Repository<SurveyTemplate>;
  let assignmentRepository: Repository<Assignment>;
  let youthRepository: Repository<Youth>;
  let reviewerRepository: Repository<Reviewer>;
  let user;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await overrideExternalDependencies(
      Test.createTestingModule({
        imports: [AppModule],
      }),
    ).compile();

    userRepository = moduleFixture.get('UserRepository');
    surveyTemplateRepository = moduleFixture.get('SurveyTemplateRepository');
    surveyRepository = moduleFixture.get('SurveyRepository');
    assignmentRepository = moduleFixture.get('AssignmentRepository');
    youthRepository = moduleFixture.get('YouthRepository');
    reviewerRepository = moduleFixture.get('ReviewerRepository');

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    await clearDb();
    user = await userRepository.save(mockUser);
    const user2 = await userRepository.save(mockUser2);

    mockSurveyTemplate.creator = user;

    const surveyTemplate = await surveyTemplateRepository.save(mockSurveyTemplate);
    await surveyRepository.save({
      name: "Joe's favorite survey",
      creator: user,
      uuid: UUID,
      surveyTemplate,
      assignments: [],
      date: new Date('02-06-2022'),
    });

    await surveyRepository.save({
      name: 'My survey',
      creator: user2,
      uuid: UUID2,
      surveyTemplate,
      assignments: [],
      date: new Date('02-06-2022'),
    });
  });

  it('should find all the surveys created by the user', async () => {
    const response = await request(app.getHttpServer())
      .get('/survey')
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'test@test.com' })}`);

    const expected = {
      id: 1,
      name: "Joe's favorite survey",
      uuid: UUID,
      date: new Date('02-06-2022').toJSON(),
    };

    expect(response.body).toEqual([expected]);
    expect(response.statusCode).toBe(200);
  });

  it('should return the survey by the given uuid', async () => {
    const response = await request(app.getHttpServer())
      .get(`/survey/${UUID}`)
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'test@test.com' })}`);

    const expected = {
      id: 1,
      name: "Joe's favorite survey",
      uuid: UUID,
      date: new Date('02-06-2022').toJSON(),
    };

    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });

  it('should return the survey by another uuid', async () => {
    const response = await request(app.getHttpServer())
      .get(`/survey/${UUID2}`)
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'something@test.com' })}`);

    const expected = {
      id: 2,
      name: 'My survey',
      uuid: UUID2,
      date: new Date('02-06-2022').toJSON(),
    };

    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });

  it('should return a 400 when the uuid is invalid', async () => {
    const response = await request(app.getHttpServer())
      .get(`/survey/invalid-uuid`)
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'something@test.com' })}`);
    expect(response.statusCode).toBe(400);
  });

  it('should fetch a survey for a reviewer', async () => {
    // Setup
    const questionText = 'Do you like writing integration tests?';
    const optionText = 'Yes!';
    const template = await surveyTemplateRepository.save({
      user,
      questions: [
        {
          text: questionText,
          options: [
            {
              text: optionText,
            },
          ],
        },
      ],
    });

    const reviewer = await reviewerRepository.save({
      email: 'reviewer.email@email.com',
      firstName: 'Jonathan',
      lastName: 'Frakes',
    });

    const youthControl = await youthRepository.save({
      email: 'youth1@email.com',
      firstName: 'Alan',
      lastName: 'Turing',
      role: YouthRoles.CONTROL,
    });

    const youthTreatment1 = await youthRepository.save({
      email: 'youth2@email.com',
      firstName: 'Alonzo',
      lastName: 'Church',
    });

    const youthTreatment2 = await youthRepository.save({
      email: 'youth3@email.com',
      firstName: 'Kurt',
      lastName: 'Godel',
    });

    const survey = await surveyRepository.save({
      surveyTemplate: template,
      user,
      name: 'E2E Survey',
      assignments: [
        {
          // control
          reviewer,
          youth: youthControl,
        },
        {
          // treatment
          reviewer,
          youth: youthTreatment1,
        },
        {
          // completed (should be ignored)
          reviewer,
          youth: youthTreatment2,
          status: AssignmentStatus.COMPLETED,
        },
      ],
    });

    // Act
    const response = await request(app.getHttpServer()).get(
      `/survey/${survey.uuid}/${reviewer.uuid}`,
    );

    // Assert
    expect(response.body).toEqual({
      reviewer: {
        email: reviewer.email,
        firstName: reviewer.firstName,
        lastName: reviewer.lastName,
      },
      controlYouth: [
        {
          assignmentUuid: survey.assignments[0].uuid,
          firstName: youthControl.firstName,
          lastName: youthControl.lastName,
          email: youthControl.email,
        },
      ],
      treatmentYouth: [
        {
          assignmentUuid: survey.assignments[1].uuid,
          firstName: youthTreatment1.firstName,
          lastName: youthTreatment1.lastName,
          email: youthTreatment1.email,
        },
      ],
      questions: [
        {
          question: questionText,
          options: [optionText],
        },
      ],
    });
  });

  it('should create batch assignments', async () => {
    const dto: CreateBatchAssignmentsDto = {
      surveyUUID: UUID,
      pairs: [
        {
          youth: {
            email: 'one@youth.com',
            firstName: 'One',
            lastName: 'Youth',
          },
          reviewer: {
            email: 'one@reviewer.com',
            firstName: 'One',
            lastName: 'Reviewer',
          },
        },
        {
          youth: {
            email: 'two@youth.com',
            firstName: 'Two',
            lastName: 'Youth',
          },
          reviewer: {
            email: 'two@reviewer.com',
            firstName: 'Two',
            lastName: 'Reviewer',
          },
        },
      ],
    };

    const youthSave = jest.spyOn(youthRepository, 'save');
    const reviewerSave = jest.spyOn(reviewerRepository, 'save');
    const assignmentSave = jest.spyOn(assignmentRepository, 'save');

    await request(app.getHttpServer())
      .patch(`/survey`)
      .set('Authorization', `Bearer ${JSON.stringify({ email: 'something@test.com' })}`)
      .send(dto);
    expect(youthSave).toHaveBeenCalledTimes(1);
    expect(reviewerSave).toHaveBeenCalledTimes(1);
    expect(assignmentSave).toHaveBeenCalledTimes(1);
  });

  afterAll(async () => await app.close());
});
