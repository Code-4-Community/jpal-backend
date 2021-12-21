import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { Survey } from '../../src/survey/types/survey.entity';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { clearDb } from '../e2e.utils';
import { overrideExternalDependencies } from '../mockProviders';
import { mockUser } from '../../src/user/user.service.spec';
import { mockSurveyTemplate } from '../../src/survey/survey.service.spec';
import { User } from '../../src/user/types/user.entity';
import { SurveyTemplate } from '../../src/surveyTemplate/types/surveyTemplate.entity';
import { Role } from '../../src/user/types/role';
import { Question } from '../../src/question/types/question.entity';
import { Option } from '../../src/option/types/option.entity';
import { Response } from '../../src/response/types/response.entity';
import { Assignment } from '../../src/assignment/types/assignment.entity';
import { Youth } from '../../src/youth/types/youth.entity';
import { Reviewer } from '../../src/reviewer/types/reviewer.entity';
import { assert } from 'console';
import { youthExamples } from '../../src/youth/youth.examples';
import { reviewerExamples } from '../../src/reviewer/reviewer.examples';
import { AssignmentStatus } from '../../src/assignment/types/assignmentStatus';

const surveyUUID = '123e4567-e89b-12d3-a456-426614174000';
const assignmentUUID = 'a48bea54-4948-4f38-897e-f47a042c891d';

describe('Assignment e2e', () => {
  let app: INestApplication;
  let surveyRepository: Repository<Survey>;
  let userRepository: Repository<User>;
  let surveyTemplateRepository: Repository<SurveyTemplate>;
  let questionRepository: Repository<Question>;
  let optionRepository: Repository<Option>;
  let assignmentRepository: Repository<Assignment>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await overrideExternalDependencies(
      Test.createTestingModule({
        imports: [AppModule],
      }),
    ).compile();

    userRepository = moduleFixture.get('UserRepository');
    surveyTemplateRepository = moduleFixture.get('SurveyTemplateRepository');
    surveyRepository = moduleFixture.get('SurveyRepository');
    questionRepository = moduleFixture.get('QuestionRepository');
    optionRepository = moduleFixture.get('OptionRepository');
    assignmentRepository = moduleFixture.get('AssignmentRepository');

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    await clearDb();
    const user = await userRepository.save(mockUser);

    mockSurveyTemplate.creator = user;

    const question = new Question();
    question.id = 1;
    question.text = 'How often is this student responsible?';
    await questionRepository.save(question);

    const option = new Option();
    option.id = 1;
    option.text = 'Always';
    option.question = question;
    await optionRepository.save(option);

    const surveyTemplate = await surveyTemplateRepository.save({
      ...mockSurveyTemplate,
      questions: [question],
    });

    const survey = await surveyRepository.save({
      name: "Ryan's favorite survey",
      creator: user,
      uuid: surveyUUID,
      id: 1,
      surveyTemplate,
    });

    await assignmentRepository.save({
      survey,
      id: 1,
      uuid: assignmentUUID,
      youth: youthExamples[0],
      reviewer: reviewerExamples[0],
      responses: [],
    });
  });

  it('test', () => {
    expect(true).toBeTruthy();
  });

  it('should record responses and mark as completed', async () => {
    const response = await request(app.getHttpServer())
      .post(`/assignment/${assignmentUUID}`)
      .send({
        responses: [
          {
            question: 'How often is this student responsible?',
            selectedOption: 'Always',
          },
        ],
      });

    console.log(response.body);
    const expected = new Assignment();
    expected.id = 1;
    expected.status = AssignmentStatus.COMPLETED;
    expected.uuid = assignmentUUID;

    console.log(response.body);

    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(201);
  });

  afterAll(async () => await app.close());
});
