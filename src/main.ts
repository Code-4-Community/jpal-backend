import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  await app.listen(3000);
}
bootstrap();
