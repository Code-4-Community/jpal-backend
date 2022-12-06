import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateReviewerDto } from './dto/update-reviewer-dto';
import { Reviewer } from './types/reviewer.entity';

@Injectable()
export class ReviewerService {
  private logger = new Logger(ReviewerService.name);

  constructor(
    @InjectRepository(Reviewer)
    private reviewerRepository: Repository<Reviewer>,
  ) {}

  async getByUuid(uuid: string): Promise<Reviewer> {
    return await this.reviewerRepository.findOne({
      relations: [],
      where: { uuid },
    });
  }

  async updateReviewer(uuid: string, newData: UpdateReviewerDto): Promise<Reviewer> {
    try {
      const reviewer = await this.getByUuid(uuid);

      if (!reviewer) {
        throw new BadRequestException('Reviewer not found.');
      }

      if (newData.secondaryEmail) {
        reviewer.secondaryEmail = newData.secondaryEmail;
      }

      if (newData.phone) {
        reviewer.phone = newData.phone;
      }

      await this.reviewerRepository.save(reviewer);
      return reviewer;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
