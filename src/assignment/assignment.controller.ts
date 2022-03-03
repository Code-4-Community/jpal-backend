import { BadRequestException, Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { extractMetaData, Letter } from 'src/util/letter-generation/generateLetter';
import { AssignmentService } from './assignment.service';
import { CompleteAssignmentDto } from './dto/complete-assignment.dto';
import { Assignment } from './types/assignment.entity';

@Controller('assignment')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  /**
   * Complete an assignment and save responses. Not private because will be accessed by reviewers.
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

  @Post('/preview-letter/:uuid')
  async generatePreviewLetter(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() completeAssignmentDto: CompleteAssignmentDto,
  ): Promise<Letter> {
    const assignment = await this.assignmentService.getByUuid(uuid);
    if (!assignment) {
      throw new BadRequestException('This assignment does not exist.');
    }
    // TODO: Check assignment is in progress
    return this.assignmentService.generatePreviewLetter(
      completeAssignmentDto.responses,
      extractMetaData(assignment, new Date()),
    );
  }
}
