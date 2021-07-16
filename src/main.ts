import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as yaml from 'yaml';
import { versionFromGitTag } from '@pact-foundation/absolute-version'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('JPAL Backend')
    .setDescription('The JPAL Backend API description')
    .setVersion(versionFromGitTag())
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  fs.writeFileSync('./pact/swagger-spec.yml', yaml.stringify(document, {}));

  await app.listen(5000);
}
bootstrap();
