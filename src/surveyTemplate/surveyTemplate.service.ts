import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyTemplate } from './types/surveyTemplate.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Question } from '../question/types/question.entity';
import { transformQuestionToSurveyDataQuestion } from '../util/transformQuestionToSurveryDataQuestion';
import { User } from 'src/user/types/user.entity';
import { QuestionDto } from '../question/dto/question.dto';
import { Sentence } from '../sentence/types/sentence.entity';

export interface SurveyDataQuestion {
  question: string;
  options: string[];
}

export interface SurveyTemplateData {
  name: string;
  questions: SurveyDataQuestion[];
}

export interface SurveyNameData {
  id: number;
  name: string;
}

@Injectable()
export class SurveyTemplateService {
  async getByCreator(creator: User): Promise<SurveyNameData[]> {
    const result = await this.surveyTemplateRepository.find({
      where: { creator },
    });

    if (!result) {
      throw new BadRequestException(`Creator ${creator.id} not found`);
    }

    return result.map((surveyTemp) => {
      return { name: surveyTemp.name, id: surveyTemp.id };
    });
  }
  constructor(
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
  ) {}

  /**
   * Gets the survey template corresponding to id.
   */
  async getById(id: number): Promise<SurveyTemplateData> {
    const result = await this.surveyTemplateRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });

    if (!result) {
      throw new BadRequestException(`Survey template id ${id} not found`);
    }

    return {
      name: result.name,
      questions: transformQuestionToSurveyDataQuestion(result.questions),
    };
  }

  /**
   * Update the questions of a survey template
   * @param id             id of the survey to modify
   * @param questionDtos      new set of questions for the survey template
   */
  async updateSurveyTemplate(id: number, questionDtos: QuestionDto[]): Promise<SurveyTemplateData> {

    const questions: Question[] = [];

    for (const questionDto of questionDtos) {
      const question = await this.convertDtoToEntity(questionDto);
      questions.push(question);
    }

    const surveyTemplate = await this.getTemplateById(id);
    surveyTemplate.questions = questions;
    await this.surveyTemplateRepository.save(surveyTemplate);
    return {
      name: surveyTemplate.name,
      questions: transformQuestionToSurveyDataQuestion(questions),
    };
  }

  /**
   * Update the name of a survey template
   * @param id           the id of the survey to modify
   * @param name         the new name of the survey template
   */
  async updateSurveyTemplateName(id: number, name: string): Promise<SurveyTemplateData> {
    const surveyTemplate = await this.getTemplateById(id);
    surveyTemplate.name = name;
    await this.surveyTemplateRepository.save(surveyTemplate);
    return {
      name: name,
      questions: transformQuestionToSurveyDataQuestion(surveyTemplate.questions),
    };
  }

  /**
   * Delete a survey template
   * @param id    id of the survey template to be deleted
   */
  async deleteSurveyTemplate(id: number): Promise<DeleteResult> {
    try {
      await this.getTemplateById(id);
    } catch (BadRequestException) {
      throw new BadRequestException(`Survey template id ${id} not found`);
    }
    return this.surveyTemplateRepository.delete(id);
  }

  private async getTemplateById(id: number): Promise<SurveyTemplate> {
    const result = await this.surveyTemplateRepository.findOne({
      where: { id: id },
    });

    if (!result) {
      throw new BadRequestException(`Survey template id ${id} not found`);
    } else {
      return result;
    }
  }

  /**
   * Creates a survey template
   * @param creator is the creator of the survey template
   * @param name is the name of the survey template
   * @questions questions are the questions apart of the survey template
   */
  async createSurveyTemplate(
    creator: User,
    name: string,
    questions: Question[],
  ): Promise<SurveyTemplate> {
    // check for duplicate names
    if (
      await this.surveyTemplateRepository.findOne({
        where: { name: name },
      })
    ) {
      throw new BadRequestException(`Survey template with name ${name} already exists!`);
    }

    return await this.surveyTemplateRepository.save({
      creator,
      name,
      questions,
    });
  }

  private async convertDtoToEntity(questionDto: QuestionDto): Promise<Question> {
    const question = new Question();
    question.text = questionDto.text;

    if (questionDto.id) {
      question.id = questionDto.id;
    }

    if (questionDto.sentence) {
      const sentence = new Sentence();
      if (questionDto.sentence.id) sentence.id = questionDto.sentence.id;
      sentence.template = questionDto.sentence.template;
      sentence.multiTemplate = questionDto.sentence.multiTemplate;
      sentence.isPlainText = questionDto.sentence.isPlainText;
      sentence.isMultiQuestion = questionDto.sentence.isMultiQuestion;
      sentence.includeIfSelectedOptions = questionDto.sentence.includeIfSelectedOptions;
      sentence.question = question; // ✅ Set the relationship in the entity
      question.sentence = sentence;
    }

    return question;
  }

  // Helper method to convert Entity to DTO
  private convertEntityToDto(question: Question): QuestionDto {
    return {
      id: question.id,
      text: question.text,
      options: question.options?.map(option => ({
        id: option.id,
        text: option.text
      })) || [],
      sentence: question.sentence ? {
        id: question.sentence.id,
        template: question.sentence.template,
        multiTemplate: question.sentence.multiTemplate,
        isPlainText: question.sentence.isPlainText,
        isMultiQuestion: question.sentence.isMultiQuestion,
        includeIfSelectedOptions: question.sentence.includeIfSelectedOptions
      } : undefined
    };
  }
}
