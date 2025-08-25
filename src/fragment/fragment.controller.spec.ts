import { Test, TestingModule } from '@nestjs/testing';
import { Sentence } from './../sentence/types/sentence.entity';
import { Question } from './../question/types/question.entity';
import { FragmentService, FragmentData } from './fragment.service';
import { FragmentController } from './fragment.controller';
import { Fragment } from './types/fragment.entity';
import { EditDto } from 'src/util/dto/edit.dto';

export const mockFragment: Fragment = {
  id: 1,
  text: 'fragment-text',
  sentence: new Sentence(),
  question: new Question(),
  includeIfSelectedOption: 'yes',
};

export const mockFragmentDto: EditDto = {
  id: 1,
  text: 'none',
};

export const mockReturnedFragment: FragmentData = {
  id: 1,
  text: 'none',
};

export const mockFragmentService: Partial<FragmentService> = {
  updateFragmentText: jest.fn(() => Promise.resolve(mockReturnedFragment)),
};

describe('FragmentController', () => {
  let controller: FragmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FragmentController],
      providers: [
        {
          provide: FragmentService,
          useValue: mockFragmentService,
        },
      ],
    }).compile();

    controller = module.get<FragmentController>(FragmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('edit fragment text', () => {
    it('should edit the fragment text', async () => {
      await expect(controller.editFragmentText(mockFragmentDto)).resolves.toEqual(mockReturnedFragment);
      expect(mockFragmentService.updateFragmentText).toHaveBeenCalled();
    });
  });
});
