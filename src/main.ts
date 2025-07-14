import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import swaggerDocumentConfig from './swagger.config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: `C4C API - Swagger`,
  });

  Sentry.init({
    dsn: process.env.NODE_ENV === 'production' ? process.env.SENTRY_DSN : undefined,
    tracesSampleRate: 1.0,
  });

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(5001);
}
bootstrap();
