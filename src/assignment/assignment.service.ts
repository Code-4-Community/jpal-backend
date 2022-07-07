import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../util/email/email.service';
import { Youth } from '../youth/types/youth.entity';
import { Repository } from 'typeorm';
import { Option } from '../option/types/option.entity';
import { Question } from '../question/types/question.entity';
import { Response } from '../response/types/response.entity';
import DEFAULT_LETTER_GENERATION_RULES from '../util/letter-generation/defaultLetterGenerationRules';
import generateLetter, {
  AssignmentMetaData,
  Letter,
} from '../util/letter-generation/generateLetter';
import { SurveyResponseDto } from './dto/survey-response.dto';
import { Assignment } from './types/assignment.entity';
import { AssignmentStatus } from './types/assignmentStatus';
import { Cron } from '@nestjs/schedule';
import { YouthRoles } from '../youth/types/youthRoles';

@Injectable()
export class AssignmentService {
  private logger = new Logger(AssignmentService.name);

  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    @InjectRepository(Youth)
    private youthRepository: Repository<Youth>,
    private emailService: EmailService,
  ) {}

  async getByUuid(uuid: string): Promise<Assignment> {
    return await this.assignmentRepository.findOne({
      relations: ['responses', 'responses.question', 'responses.option', 'youth', 'reviewer'],
      where: { uuid },
    });
  }

  async complete(uuid: string, responses: SurveyResponseDto[]): Promise<Assignment> {
    let assignment = await this.getByUuid(uuid);

    if (assignment.responses === null) {
      assignment.status = AssignmentStatus.COMPLETED;
      return this.assignmentRepository.save(assignment);
    }

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
    return this.assignmentRepository.save(assignment);
  }

  async start(uuid: string): Promise<Assignment> {
    const assignment = await this.getByUuid(uuid);
    if (assignment.status === AssignmentStatus.COMPLETED) {
      throw new BadRequestException('This assignment has already been completed');
    }
    assignment.status = AssignmentStatus.IN_PROGRESS;
    return await this.assignmentRepository.save(assignment);
  }

  async generatePreviewLetter(
    responses: SurveyResponseDto[],
    metadata: AssignmentMetaData,
  ): Promise<Letter> {
    return generateLetter(responses, metadata, DEFAULT_LETTER_GENERATION_RULES);
  }

  async sendToYouth(assignment: Assignment): Promise<void> {
    try {
      // This will need to have the actual letter content
      await this.emailService.queueEmail(
        assignment.youth.email,
        `New letter of recommendation from ${assignment.reviewer.firstName} ${assignment.reviewer.lastName}`,
        'Letter',
      );

      assignment.sent = true;
      await this.assignmentRepository.save(assignment);
    } catch (e) {
      this.logger.error(e);
    }
  }

  // Send letters to treatment youth every day at 5pm
  @Cron('0 17 * * *')
  async sendUnsentSurveysToYouth(): Promise<void> {
    console.log('sending assignments');
    const unsentAssignments = await this.assignmentRepository.find({
      relations: ['youth', 'reviewer'],
      where: { sent: false },
    });
    await Promise.all(
      unsentAssignments.map(
        async (assignment) =>
          assignment.youth.role === YouthRoles.TREATMENT && this.sendToYouth(assignment),
      ),
    );
  }
}
