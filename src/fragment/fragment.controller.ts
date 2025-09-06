import { Controller, Get, Param, ParseIntPipe, Post, Delete, Put, Body } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { FragmentService, FragmentData } from './fragment.service';
import { EditDto } from '../util/dto/edit.dto';

@Controller('fragment')
export class FragmentController {
  constructor(private fragmentService: FragmentService) {}

  /**
   * Updates the text of a fragment
   * @param id   id of the fragment to be updated
   * @param text the new text of the fragment
   */
  @Put()
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editFragmentText(@Body() editFragmentText: EditDto): Promise<FragmentData> {
    return this.fragmentService.updateFragmentText(editFragmentText.id, editFragmentText.text);
  }
}
