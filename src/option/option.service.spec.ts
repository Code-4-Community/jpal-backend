import { Test, TestingModule } from '@nestjs/testing';
import { Question } from './../question/types/question.entity';
import { OptionService, OptionData } from './option.service';
import { Option } from './types/option.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockOption: Option = {
  id: 1,
  question: new Question(),
  text: 'text',
};

export const mockReturnedOption: OptionData = {
  id: 1,
  text: 'none',
};

const mockOptionRepository: Partial<Repository<Option>> = {
  async findOne(query: any): Promise<Option | undefined> {
    if (query.where.id === 1) return mockOption;
    return undefined;
  },
};

describe('OptionService', () => {
  let service: OptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionService,
        {
          provide: getRepositoryToken(Option),
          useValue: mockOptionRepository,
        },
      ],
    }).compile();

    service = module.get<OptionService>(OptionService);
  });

  it('should error if the requested id is not in the table', async () => {
    expect(async () => {
      await service.getById(-1);
    }).rejects.toThrow();
  });

  it('should return expected option', async () => {
    const option = await service.getById(1);
    expect(option.text).toEqual('text');
  });

  it('should error if trying to edit an id not in the table', async () => {
    expect(async () => {
      await service.updateOptionText(-1, 'none');
    }).rejects.toThrow();
  });

  it('should properly edit the option text', async () => {
    expect(async () => {
      expect(await service.updateOptionText(1, 'none')).toEqual(mockReturnedOption);
    });
  });
});
