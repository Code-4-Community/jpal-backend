import { Test, TestingModule } from '@nestjs/testing';
import { Sentence } from './../sentence/types/sentence.entity';
import { Question } from './../question/types/question.entity';
import { FragmentService, FragmentData } from './fragment.service';
import { FragmentController } from './fragment.controller';
import { Fragment } from './types/fragment.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockFragment: Fragment = {
  id: 1,
  text: 'fragment-text',
  sentence: new Sentence(),
  question: new Question(),
  includeIfSelectedOption: 'yes',
};

export const mockReturnedFragment: FragmentData = {
  id: 1,
  text: 'none',
};

const mockFragmentRepository: Partial<Repository<Fragment>> = {
  async findOne(query: any): Promise<Fragment | undefined> {
    if (query.where.id === 1) return mockFragment;
    return undefined;
  },
};

describe('FragmentService', () => {
  let service: FragmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FragmentService,
        {
          provide: getRepositoryToken(Fragment),
          useValue: mockFragmentRepository,
        },
      ],
    }).compile();

    service = module.get<FragmentService>(FragmentService);
  });

  it('should error if the requested id is not in the table', async () => {
    expect(async () => {
      await service.getById(-1);
    }).rejects.toThrow();
  });

  it('should return expected fragment', async () => {
    const fragment = await service.getById(1);
    expect(fragment.text).toEqual('fragment-text');
  });

  it('should error if trying to edit an id not in the table', async () => {
    expect(async () => {
      await service.updateFragmentText(-1, 'none');
    }).rejects.toThrow();
  });

  it('should properly edit the fragment', async () => {
    expect(async () => {
      expect(await service.updateFragmentText(1, 'none')).toEqual(mockReturnedFragment);
    });
  });
});
