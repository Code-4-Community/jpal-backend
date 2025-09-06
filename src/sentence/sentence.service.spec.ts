import { Test, TestingModule } from '@nestjs/testing';
import { Sentence } from './../sentence/types/sentence.entity';
import { Question } from './../question/types/question.entity';
import { SentenceService, SentenceTemplateData } from './sentence.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockSentence: Sentence = {
  id: 1,
  template: 'template',
  isPlainText: false,
  isMultiQuestion: false,
  includeIfSelectedOptions: [],
  question: new Question(),
  fragments: [],
};

export const mockReturnedSentence: SentenceTemplateData = {
  id: 1,
  template: 'none',
};
const mockSentenceRepository: Partial<Repository<Sentence>> = {
  async findOne(query: any): Promise<Sentence | undefined> {
    if (query.where.id === 1) return mockSentence;
    return undefined;
  },
};

describe('SentenceTemplateService', () => {
  let service: SentenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentenceService,
        {
          provide: getRepositoryToken(Sentence),
          useValue: mockSentenceRepository,
        },
      ],
    }).compile();

    service = module.get<SentenceService>(SentenceService);
  });

  it('should error if the requested id is not in the table', async () => {
    expect(async () => {
      await service.getById(-1);
    }).rejects.toThrow();
  });

  it('should return expected sentence', async () => {
    const sentence = await service.getById(1);
    expect(sentence.template).toEqual('template');
  });

  it('should error if trying to edit an id not in the table', async () => {
    expect(async () => {
      await service.updateSentenceTemplate(-1, 'template');
    }).rejects.toThrow();
  });

  it('should properly edit the sentence template', async () => {
    expect(async () => {
      expect(await service.updateSentenceTemplate(1, 'template')).toEqual(mockReturnedSentence);
    });
  });
});
