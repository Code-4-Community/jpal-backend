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
  extractMetaData,
  Letter,
} from '../util/letter-generation/generateLetter';
import { SurveyResponseDto } from './dto/survey-response.dto';
import { Assignment } from './types/assignment.entity';
import { AssignmentStatus } from './types/assignmentStatus';
import { Cron } from '@nestjs/schedule';
import { YouthRoles } from '../youth/types/youthRoles';
import { letterToPdf } from '../util/letter-generation/letter-to-pdf';

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

  async generateLetterFromCompletedAssignment(
    assignment: Assignment,
    metadata: AssignmentMetaData,
  ): Promise<Letter> {
    if (assignment.status !== AssignmentStatus.COMPLETED) {
      throw new BadRequestException('This assignment has not been completed');
    }
    const responses = await this.responseRepository.find({
      where: { assignment: assignment.id },
      relations: ['question', 'option'],
    });

    const responseDTO: SurveyResponseDto[] = responses.map((response) => ({
      question: response.question.text,
      selectedOption: response.option.text,
    }));

    return generateLetter(responseDTO, metadata, DEFAULT_LETTER_GENERATION_RULES);
  }

  youthEmailSubject(reviewerFirstName: string, reviewerLastName: string) {
    return `New letter of recommendation from ${reviewerFirstName} ${reviewerLastName}`;
  }

  youthEmailBodyHTML() {
    return `<p>Please find the attached letter of recommendation.</p>`;
  }

  async sendToYouth(assignment: Assignment): Promise<void> {
    try {
      const letter = await this.generateLetterFromCompletedAssignment(
        assignment,
        extractMetaData(assignment, new Date()),
      );
      const pdf = await letterToPdf(letter).asBuffer();

      await this.emailService.queueEmail(
        assignment.youth.email,
        this.youthEmailSubject(assignment.reviewer.firstName, assignment.reviewer.lastName),
        this.youthEmailBodyHTML(),
        [{ filename: 'letter.pdf', content: pdf }],
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
    const unsentAssignments = await this.assignmentRepository.find({
      relations: ['youth', 'reviewer'],
      where: { sent: false, status: AssignmentStatus.COMPLETED },
    });

    await Promise.all(
      unsentAssignments.map(
        async (assignment) =>
          assignment.youth.role === YouthRoles.TREATMENT && this.sendToYouth(assignment),
      ),
    );
  }

  reviewerEmailSubject(youthFirstName: string, youthLastName: string) {
    return `Reminder: Incomplete survey for ${youthFirstName} ${youthLastName}.`;
  }

  reviewerEmailHTML(youthFirstName: string, youthLastName: string) {
    return `<p>You have an unfinished survey for ${youthFirstName} ${youthLastName}. Please complete it soon.</p>`;
  }

  async sendToReviewer(assignment: Assignment): Promise<void> {
    try {
      await this.emailService.queueEmail(
        assignment.reviewer.email,
        this.reviewerEmailSubject(assignment.youth.firstName, assignment.youth.lastName),
        this.reviewerEmailHTML(assignment.youth.firstName, assignment.youth.lastName),
      );
      assignment.reminderSent = true;
      await this.assignmentRepository.save(assignment);
    } catch (e) {
      this.logger.error(e);
    }
  }

  // Send reminders for incomplete surveys that are over a week old
  @Cron('0 17 * * *')
  async sendRemindersToReviewers(): Promise<void> {
    const unfinishedAssignments = await this.assignmentRepository.find({
      relations: ['reviewer', 'survey', 'youth'],
      where: [
        { status: AssignmentStatus.IN_PROGRESS, reminderSent: false },
        { status: AssignmentStatus.INCOMPLETE, reminderSent: false },
      ],
    });
    await Promise.all(
      unfinishedAssignments.map(async (assignment) => {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        lastWeek.setHours(0, 0, 0, 0);

        if (assignment.started <= lastWeek) {
          this.sendToReviewer(assignment);
        }
      }),
    );
  }
}
