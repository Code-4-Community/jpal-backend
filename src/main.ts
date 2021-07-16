import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerDocumentConfig from './swagger.config';
import { AppModule } from './app.module';
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

  const document = SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: `C4C API - Swagger`,
  });

  await app.listen(5000);
}
bootstrap();
