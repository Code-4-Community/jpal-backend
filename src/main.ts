import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as YAML from 'js-yaml';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

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
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: `C4C API - Swagger`,
  });
  fs.writeFileSync(
    './pact/swagger-spec.yml',
    YAML.dump(document, { noRefs: true }),
  );

  await app.listen(5000);
}
bootstrap();
