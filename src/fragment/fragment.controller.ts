import { Controller, Get, Param, ParseIntPipe, Post, Delete, Put, Body } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { FragmentService, FragmentData } from './fragment.service';

@Controller('fragment')
export class FragmentControlelr {
  constructor(private fragmentService: FragmentService) {}

  /**
   * Updates the text of a fragment
   * @param id   id of the fragment to be updated
   * @param text the new text of the fragment
   */
  @Put('/fragment/:id')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editFragmentText(id: number, text: string): Promise<FragmentData> {
    return this.fragmentService.updateFragmentText(id, text);
  }
}
