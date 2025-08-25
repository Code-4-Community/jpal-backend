import { Test, TestingModule } from '@nestjs/testing';
import { Question } from './../question/types/question.entity';
import { OptionService, OptionData } from './option.service';
import { OptionController } from './option.controller';
import { Option } from './types/option.entity';
import { EditDto } from '../util/dto/edit.dto';

export const mockOption: Option = {
  id: 1,
  question: new Question(),
  text: 'text',
};

export const mockOptionDto: EditDto = {
  id: 1,
  text: 'none',
};

export const mockReturnedOption: OptionData = {
  id: 1,
  text: 'none',
};

export const mockOptionService: Partial<OptionService> = {
  updateOptionText: jest.fn(() => Promise.resolve(mockReturnedOption)),
};

describe('OptionController', () => {
  let controller: OptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionController],
      providers: [
        {
          provide: OptionService,
          useValue: mockOptionService,
        },
      ],
    }).compile();

    controller = module.get<OptionController>(OptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('edit option text', () => {
    it('should edit the option text', async () => {
      await expect(controller.editOptionText(mockOptionDto)).resolves.toEqual(mockReturnedOption);
      expect(mockOptionService.updateOptionText).toHaveBeenCalled();
    });
  });
});
