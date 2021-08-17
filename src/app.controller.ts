import { Controller, Get, ImATeapotException } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  public hello(): string {
    throw new ImATeapotException();
    return 'Hello, World!';
  }
}
