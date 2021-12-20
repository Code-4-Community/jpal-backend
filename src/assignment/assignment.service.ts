import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../survey/types/survey.entity';
import { Assignment } from './types/assignment.entity';
import { AssignmentStatus } from './types/assignmentStatus';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  async complete(uuid: string): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { uuid },
    });

    return this.assignmentRepository.save({
      ...assignment, // existing fields
      status: AssignmentStatus.COMPLETED,
    });
  }
}
