import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import swaggerDocumentConfig from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
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

  await app.listen(5000);
}
bootstrap();
