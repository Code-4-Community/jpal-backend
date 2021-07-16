import { DocumentBuilder } from '@nestjs/swagger';

export default new DocumentBuilder()
  .setTitle('C4C Backend Docs')
  .setDescription('API docs for a C4C backend.')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
  })
  .build();
