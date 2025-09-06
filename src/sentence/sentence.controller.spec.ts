import { Test, TestingModule } from '@nestjs/testing';
import { Sentence } from './../sentence/types/sentence.entity';
import { Question } from './../question/types/question.entity';
import { SentenceService, SentenceTemplateData } from './sentence.service';
import { SentenceController } from './sentence.controller';
import { EditSentenceDto } from './dto/editSentence.dto';

export const mockSentence: Sentence = {
  id: 1,
  template: 'template',
  isPlainText: false,
  isMultiQuestion: false,
  includeIfSelectedOptions: [],
  question: new Question(),
  fragments: [],
};

export const mockSentenceDto: EditSentenceDto = {
  id: 1,
  template: 'none',
};

export const mockReturnedSentence: SentenceTemplateData = {
  id: 1,
  template: 'none',
};

export const mockSentenceService: Partial<SentenceService> = {
  updateSentenceTemplate: jest.fn(() => Promise.resolve(mockReturnedSentence)),
};

describe('SentenceController', () => {
  let controller: SentenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentenceController],
      providers: [
        {
          provide: SentenceService,
          useValue: mockSentenceService,
        },
      ],
    }).compile();

    controller = module.get<SentenceController>(SentenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('edit survey template', () => {
    it('should edit the survey template', async () => {
      await expect(controller.editSentenceTemplate(mockSentenceDto)).resolves.toEqual(
        mockReturnedSentence,
      );
      expect(mockSentenceService.updateSentenceTemplate).toHaveBeenCalled();
    });
  });
});
