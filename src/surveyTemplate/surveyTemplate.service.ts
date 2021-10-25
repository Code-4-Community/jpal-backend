import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SurveyTemplateService {
  constructor(
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
  ) {}

  /**
   * Gets the survey template corresponding to id.
   */
  async getById(id: number): Promise<SurveyTemplate> {
    const requestedSurveyTemplate = this.surveyTemplateRepository.findOne({
      where: { id: id },
    });

    if (requestedSurveyTemplate === undefined) {
      throw new BadRequestException(`Survey template id ${id} not found`);
    }
    return requestedSurveyTemplate;
  }
}
