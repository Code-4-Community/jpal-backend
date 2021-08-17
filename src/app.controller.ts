import { Controller, Get, ImATeapotException } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  public hello(): string {
    return 'Hello, World!';
  }
}
