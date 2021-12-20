import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from '../option/types/option.entity';
import { Question } from '../question/types/question.entity';
import { Repository } from 'typeorm';
import { SurveyResponseDto } from './dto/survey-response.dto';
import { Assignment } from './types/assignment.entity';
import { Response } from '../response/types/response.entity';
import { AssignmentStatus } from './types/assignmentStatus';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  async getByUuid(uuid: string): Promise<Assignment> {
    return await this.assignmentRepository.findOne({
      where: { uuid },
    });
  }

  async complete(
    uuid: string,
    responses: SurveyResponseDto[],
  ): Promise<Assignment> {
    let assignment = await this.getByUuid(uuid);

    if (assignment.status === AssignmentStatus.COMPLETED) {
      throw new BadRequestException(
        'Responses for this assignment have already been recorded.',
      );
    }

    responses.forEach(async (response) => {
      const question = await this.questionRepository.findOne({
        where: { text: response.question },
      });

      if (question === undefined) {
        throw new BadRequestException('Question does not exist');
      }

      const option = await this.optionRepository.findOne({
        where: { text: response.selectedOption },
      });

      if (option === undefined || !question.options.includes(option)) {
        throw new BadRequestException('Option does not exist');
      }

      const newResponse = new Response();
      newResponse.question = question;
      newResponse.option = option;
      newResponse.assignment = assignment;

      await this.responseRepository.save(newResponse);
    });

    assignment = await this.getByUuid(uuid);
    assignment.status = AssignmentStatus.COMPLETED;
    return await this.assignmentRepository.save(assignment);
  }
}
