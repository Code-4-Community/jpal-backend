import { BadRequestException, Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { UpdateReviewerDto } from './dto/update-reviewer-dto';
import { ReviewerService } from './reviewer.service';
import { Reviewer } from './types/reviewer.entity';

@Controller('reviewer')
export class ReviewerController {
  constructor(private reviewerService: ReviewerService) {}

  /**
   * @param uuid UUID of the reviewer
   * @throws BadRequestException if the assignment does not exist
   */
  private async assertReviewerWithUuidExists(uuid: string): Promise<void> {
    if (!(await this.reviewerService.getByUuid(uuid))) {
      throw new BadRequestException('This reviewer does not exist.');
    }
  }

  /**
   * Update a reviewer's email and/or phone number.
   * @param uuid UUID of the reviewer
   * @throws BadRequestException if the reviewer does not exist
   */
  @Patch(':uuid')
  async updateReviewer(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateReviewerDto: UpdateReviewerDto,
  ): Promise<Reviewer> {
    await this.assertReviewerWithUuidExists(uuid);
    return await this.reviewerService.updateReviewer(uuid, updateReviewerDto);
  }
}
