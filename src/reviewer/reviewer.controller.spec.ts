import { Test, TestingModule } from '@nestjs/testing';
import { ReviewerController } from './reviewer.controller';
import { ReviewerService } from './reviewer.service';
import { reviewerExamples } from './reviewer.examples';
import { Reviewer } from './types/reviewer.entity';
import { UpdateReviewerDto } from './dto/update-reviewer-dto';

const mockReviewer: Reviewer = {
  ...reviewerExamples[0],
  uuid: '00000000-0000-0000-0000-000000000000',
  id: 1,
};

const mockReviewerService: Partial<ReviewerService> = {
  async getByUuid(uuid: string): Promise<Reviewer> {
    return mockReviewer;
  },

  async updateReviewer(uuid: string, newData: UpdateReviewerDto): Promise<Reviewer> {
    const reviewer = await this.getByUuid(uuid);
    reviewer.secondaryEmail = newData.secondaryEmail;
    reviewer.phone = newData.phone;
    return reviewer;
  },
};

const mockUpdateReviewerDto: UpdateReviewerDto = {
  secondaryEmail: 'newEmail@test.com',
  phone: '555-555-5555',
};

describe('ReviewerController', () => {
  let controller: ReviewerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewerController],
      providers: [
        {
          provide: ReviewerService,
          useValue: mockReviewerService,
        },
      ],
    }).compile();

    controller = module.get<ReviewerController>(ReviewerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fail to update a reviewer that does not exist', async () => {
    jest.spyOn(mockReviewerService, 'getByUuid').mockResolvedValueOnce(undefined);
    await expect(controller.updateReviewer('bad-uuid', mockUpdateReviewerDto)).rejects.toThrow(
      'This reviewer does not exist.',
    );
  });

  it('should update a reviewer', async () => {
    const reviewer = await controller.updateReviewer(
      '00000000-0000-0000-0000-000000000000',
      mockUpdateReviewerDto,
    );
    expect(reviewer.secondaryEmail).toEqual(mockUpdateReviewerDto.secondaryEmail);
    expect(reviewer.phone).toEqual(mockUpdateReviewerDto.phone);
  });
});
