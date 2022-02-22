import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CompleteAssignmentDto } from './dto/complete-assignment.dto';
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
  async complete(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() completeAssignmentDto: CompleteAssignmentDto,
  ): Promise<Assignment> {
    if (!(await this.assignmentService.getByUuid(uuid))) {
      throw new BadRequestException('This assignment does not exist.');
    }
    return this.assignmentService.complete(uuid, completeAssignmentDto.responses);
  }

  @Patch(':uuid')
  start(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<Assignment> {
    if (!this.assignmentService.getByUuid(uuid)) {
      throw new BadRequestException('This assignment does not exist.');
    }
    return this.assignmentService.start(uuid);
  }
}
