import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { Assignment } from './types/assignment.entity';

@Controller('assignment')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  /**
   * Complete an assignment and save responses. Not private because will be accessed by reveiwers.
   * @param completeAssignmentDto the responses
   * @returns Assignment
   */
  @Post(':uuid')
  complete(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<Assignment> {
    return this.assignmentService.complete(uuid);
  }
}
