import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { reviewerExamples } from './reviewer.examples';
import { ReviewerService } from './reviewer.service';
import { Reviewer } from './types/reviewer.entity';

const mockReviewer: Reviewer = {
  ...reviewerExamples[0],
  uuid: '00000000-0000-0000-0000-000000000000',
  id: 1,
};

export const mockReviewerRepository: Partial<Repository<Reviewer>> = {
  async findOne() {
    return mockReviewer;
  },

  save<T>(reviewer): T {
    return reviewer;
  },
};

describe('ReviewerService', () => {
  let service: ReviewerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewerService,
        { provide: getRepositoryToken(Reviewer), useValue: mockReviewerRepository },
      ],
    }).compile();

    service = module.get<ReviewerService>(ReviewerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a reviewer', async () => {
    jest.spyOn(mockReviewerRepository, 'findOne').mockResolvedValueOnce(mockReviewer);

    const result = await service.getByUuid('00000000-0000-0000-0000-000000000000');
    expect(result).toEqual(mockReviewer);
  });

  it('should update a reviewer', async () => {
    jest.spyOn(mockReviewerRepository, 'findOne').mockResolvedValueOnce(mockReviewer);

    const result = await service.updateReviewer('00000000-0000-0000-0000-000000000000', {
      secondaryEmail: 'newEmail@test.com',
      phone: '555-555-5555',
    });
    expect(result).toEqual({
      ...mockReviewer,
      secondaryEmail: 'newEmail@test.com',
      phone: '555-555-5555',
    });
  });
});
