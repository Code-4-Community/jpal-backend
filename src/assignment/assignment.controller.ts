import { Controller } from '@nestjs/common';
import { AssignmentService } from './assignment.service';

@Controller('assignment')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}
}
