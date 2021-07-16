import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { AppModule } from '../src/app.module';
import * as YAML from 'js-yaml';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
    const config = new DocumentBuilder()
      .setTitle('C4C Backend Docs')
      .setDescription('API docs for a C4C backend.')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        bearerFormat: 'Bearer {token}',
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync(
      './pact/swagger-spec.yml',
      YAML.dump(document, { noRefs: true }),
    );
  });

  test('created swagger yml', async () => {
    expect(
      fs.promises
        .access('./pact/swagger-spec.yml', fs.constants.F_OK)
        .then(() => true)
        .catch(() => false),
    ).toBeTruthy();
  });
  afterAll(() => {
    app.close();
  });
});
