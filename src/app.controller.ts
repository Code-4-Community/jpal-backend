import { Controller, Get, Post } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  public hello(): string {
    return 'Hello, World!';
  }
}
