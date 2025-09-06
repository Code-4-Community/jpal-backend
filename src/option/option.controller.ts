import { Controller, Get, Param, ParseIntPipe, Post, Delete, Put, Body } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../user/types/role';
import { OptionService, OptionData } from './option.service';
import { EditDto } from '../util/dto/edit.dto';

@Controller('option')
export class OptionController {
  constructor(private optionService: OptionService) {}

  /**
   * Updates the text of an option
   * @param id   id of the option to be updated
   * @param text the new text of the option
   */
  @Put()
  @Auth(Role.ADMIN, Role.RESEARCHER)
  async editOptionText(@Body() editOptionText: EditDto): Promise<OptionData> {
    return this.optionService.updateOptionText(editOptionText.id, editOptionText.text);
  }
}
