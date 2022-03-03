import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DEFAULT_LETTER_GENERATION_RULES from 'src/util/letter-generation/defaultLetterGenerationRules';
import generateLetter, {
  AssignmentMetaData,
  Letter,
} from 'src/util/letter-generation/generateLetter';
import { Repository } from 'typeorm';
import { Option } from '../option/types/option.entity';
import { Question } from '../question/types/question.entity';
import { Response } from '../response/types/response.entity';
import { SurveyResponseDto } from './dto/survey-response.dto';
import { Assignment } from './types/assignment.entity';
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
      relations: ['responses', 'responses.question', 'responses.option', 'youth', 'reviewer'],
      where: { uuid },
    });
  }

  async complete(uuid: string, responses: SurveyResponseDto[]): Promise<Assignment> {
    let assignment = await this.getByUuid(uuid);

    if (assignment.status === AssignmentStatus.COMPLETED) {
      throw new BadRequestException('Responses for this assignment have already been recorded.');
    }

    const responsesToSave: Omit<Response, 'id'>[] = await Promise.all(
      responses.map(async (response) => {
        const question = await this.questionRepository.findOne({
          where: { text: response.question },
          relations: ['options'],
        });

        if (question === undefined) {
          throw new BadRequestException('Question does not exist');
        }

        const selectedOption = await this.optionRepository.findOne({
          where: { text: response.selectedOption },
        });

        if (
          selectedOption === undefined ||
          !question.options.some((o) => o.text === selectedOption.text)
        ) {
          throw new BadRequestException('Option does not exist');
        }

        return {
          question,
          option: selectedOption,
          assignment,
        };
      }),
    );
    await this.responseRepository.save(responsesToSave);
    assignment = await this.getByUuid(uuid);
    assignment.status = AssignmentStatus.COMPLETED;
    await this.assignmentRepository.save(assignment);
    return await this.getByUuid(uuid);
  }

  async generatePreviewLetter(
    responses: SurveyResponseDto[],
    metadata: AssignmentMetaData,
  ): Promise<Letter> {
    return generateLetter(responses, metadata, DEFAULT_LETTER_GENERATION_RULES);
  }
}
