import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './types/question.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { Option } from '../option/types/option.entity';
import { Fragment } from '../fragment/types/fragment.entity';

export class UploadQuestionData {
  text: string;
  options: string[];
  sentence_template: string;
  include_if_selected_options: string[];

  constructor(
    text: string,
    options: string[],
    sentence_template: string,
    include_if_selected_options: string[]
  ) {
    this.text = text;
    this.options = options;
    this.sentence_template = sentence_template;
    this.include_if_selected_options = include_if_selected_options;
  }

}

export class UploadMultiQuestionData {
  sentence_template: string;
  fragment_texts: string[];
  question_texts: string[];
  options: string[][];
  include_if_selected_option: string[];

  constructor(
    sentence_template: string,
    fragment_texts: string[],
    question_texts: string[],
    options: string[][],
    include_if_selected_option: string[]
  ) {
    this.sentence_template = sentence_template;
    this.fragment_texts = fragment_texts;
    this.question_texts = question_texts;
    this.options = options;
    this.include_if_selected_option = include_if_selected_option;
  }
}

@Injectable()
export class QuestionService {
  private logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Question) private questionRepository: Repository<Question>,
    @InjectRepository(Sentence) private sentenceRepository: Repository<Sentence>,
    @InjectRepository(Option) private optionRepository: Repository<Option>,
    @InjectRepository(Fragment) private fragmentRepository: Repository<Fragment>,
  ) {}

  /**
   * Create plain text sentences
   * @param plain_text  array of plain text sentence templates
   */
  async batchCreatePlainText(
    plain_text: string[]
  ): Promise <number> {

    let numCreatedSentences = 0;

    for (const sentence of plain_text){
      await this.sentenceRepository.insert({
        template: sentence,
        isPlainText: true,
        isMultiQuestion: false,
        includeIfSelectedOptions: [],
        question: undefined
      })

      numCreatedSentences++;
    }
    return numCreatedSentences;
  }

  async batchCreateQuestions(
    questionData: UploadQuestionData[]
  ): Promise<number> {
    let numCreatedQuestions = 0;

    for (const questionInfo of questionData){
      const question = await this.questionRepository.save({
        text: questionInfo.text,
      })

      questionInfo.options.map(async (optionText) => await this.optionRepository.save({
        question: question,
        text: optionText
      }))

      const sentence = await this.sentenceRepository.save(
        {
          template: questionInfo.sentence_template,
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: questionInfo.include_if_selected_options,
          question: question
        }
      )

      question.sentence = sentence;
      await this.questionRepository.save(question)

      numCreatedQuestions++;
    }

    return numCreatedQuestions;
  }

  async batchCreateMultiQuestions(
    multiQuestionData: UploadMultiQuestionData[]
  ): Promise<number> {

    let numCreatedQuestions = 0;


    for (const questionInfo of multiQuestionData) {

      for (let i = 0; i < questionInfo.question_texts.length; i++) {
        const questionText = questionInfo.question_texts[i];
        const fragmentText = questionInfo.fragment_texts[i];
        const optionList = questionInfo.options[i];
        const includeIfSelected = questionInfo.include_if_selected_option[i];

        const question = await this.questionRepository.save({
          text: questionText,
        })

        optionList.map(async (optionText) => await this.optionRepository.save({
          question: question,
          text: optionText
        }))

        // sentence should not have template and multitemplate
        const sentence = await this.sentenceRepository.save(
          {
            template: questionInfo.sentence_template,
            isPlainText: false,
            isMultiQuestion: true,
            question: question
          }
        )

        await this.fragmentRepository.save(
          {
            text: fragmentText,
            sentence: sentence,
            question: question,
            includeIfSelectedOption: includeIfSelected,
          }
        )

        question.sentence = sentence;
        await this.questionRepository.save(question)

        numCreatedQuestions++

      }
    }

    return numCreatedQuestions;
  }
}
