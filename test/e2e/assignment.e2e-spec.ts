import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { Assignment } from '../../src/assignment/types/assignment.entity';
import { AssignmentStatus } from '../../src/assignment/types/assignmentStatus';
import { Option } from '../../src/option/types/option.entity';
import { Question } from '../../src/question/types/question.entity';
import { reviewerExamples } from '../../src/reviewer/reviewer.examples';
import { mockSurveyTemplate } from '../../src/survey/survey.controller.spec';
import { Survey } from '../../src/survey/types/survey.entity';
import { SurveyTemplate } from '../../src/surveyTemplate/types/surveyTemplate.entity';
import { User } from '../../src/user/types/user.entity';
import { mockUser } from '../../src/user/user.service.spec';
import { youthExamples } from '../../src/youth/youth.examples';
import { clearDb } from '../e2e.utils';
import { overrideExternalDependencies } from '../mockProviders';

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

    expect(response.body).toEqual({
      id: 1,
      status: AssignmentStatus.COMPLETED,
      uuid: assignmentUUID,
      responses: [
        {
          id: 1,
          question: {
            id: 1,
            text: 'How often is this student responsible?',
          },
          option: {
            id: 1,
            text: 'Always',
          },
        },
      ],
      sent: false,
      // hacky sure, but we dont care about these anyway
      reviewer: null,
      youth: null,
    });
    expect(response.statusCode).toBe(201);
  });

  // To identify difficult bugs, do not generally test bad paths like this.
  it('should show bad request error when option is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post(`/assignment/${assignmentUUID}`)
      .send({
        responses: [
          {
            question: 'How often is this student responsible?',
            selectedOption: 'Yes',
          },
        ],
      });
    expect(response.statusCode).toBe(400);
  });

  afterAll(async () => await app.close());
});
