import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './types/option.entity';

export interface OptionData {
    id:number;
    text:string;
}

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  /**
   * Gets the option corresponding to id.
   */
  async getById(id: number): Promise<OptionData> {
    const result = await this.optionRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new BadRequestException(`Option id ${id} not found`);
    }

    return {
      id: result.id,
      text:result.text,
    };
  }

  /**
   * Update the text of an option
   * @param id             id of the option to modify
   * @param text   new text for the option
   */
  async updateOptionText(id: number, text: string): Promise<OptionData> {
    const option = await this.getById(id);
    option.text = text;
    await this.optionRepository.save(option);
    return {
      id: option.id,
      text: option.text,
    };
  }
}
