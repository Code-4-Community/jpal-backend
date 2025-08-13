import { Controller, Get, Param, ParseIntPipe, Post, Delete, Put, Body } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { OptionService, OptionData } from './option.service';

@Controller('option')
export class OptionController {
  constructor(private optionService: OptionService) {}

  /**
   * Updates the text of an option
   * @param id   id of the option to be updated
   * @param text the new text of the option
   */
  @Put('/option/:id')
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editOptionText(id: number, text: string): Promise<OptionData> {
    return this.optionService.updateOptionText(id, text);
  }
}
