import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fragment } from './types/fragment.entity';

export interface FragmentData {
    id:number;
    text:string;
}

@Injectable()
export class FragmentService {
  constructor(
    @InjectRepository(Fragment)
    private fragmentRepository: Repository<Fragment>,
  ) {}

  /**
   * Gets the fragment corresponding to id.
   */
  async getById(id: number): Promise<FragmentData> {
    const result = await this.fragmentRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new BadRequestException(`Fragment id ${id} not found`);
    }

    return {
      id: result.id,
      text:result.text,
    };
  }

  /**
   * Update the text of a fragment
   * @param id             id of the fragment to modify
   * @param text   new text for the fragment
   */
  async updateFragmentText(id: number, text: string): Promise<FragmentData> {
    const fragment = await this.getById(id);
    fragment.text = text;
    await this.fragmentRepository.save(fragment);
    return {
      id: fragment.id,
      text: fragment.text,
    };
  }
}
