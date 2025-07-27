import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

}
