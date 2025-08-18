import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './types/question.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { Option } from '../option/types/option.entity';
import { Fragment } from '../fragment/types/fragment.entity';

export interface QuestionData {
  id: number;
  text: string;
  template: string;
  options: string[];
}

export interface UploadQuestionData {
  text: string;
  options: string[];
  sentence_template: string;
  include_if_selected_options: string[];
}

export interface UploadMultiQuestionData {
  sentence_template: string;
  fragment_texts: string[];
  question_texts: string[];
  options: string[][];
  include_if_selected_option: string[];
}

export function transformToQuestionData(questionEntities: Question[]): QuestionData[] {
  return questionEntities.map((q) => ({
    id: q.id,
    text: q.text,
    template: q.sentence.template,
    options: q.options.map((o) => o.text),
  }));
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

  async getAllQuestions(): Promise<QuestionData[]> {
    const result = await this.questionRepository.find({});
    return transformToQuestionData(result);
  }

  /**
   * Validates that includeIfSelected options exist in the available options
   * @param includeIfSelected - Array of options that should be included
   * @param availableOptions - Array of all available options
   * @param contextInfo - Additional context for error messaging (e.g., question index)
   */
  private validateIncludeIfSelectedOptions(
    includeIfSelected: string[],
    availableOptions: string[],
    contextInfo: string,
  ): void {
    if (!includeIfSelected?.length) return;

    const invalidOptions = includeIfSelected.filter(
      (selectedOption) => !availableOptions.includes(selectedOption),
    );

    if (invalidOptions.length > 0) {
      throw new BadRequestException(
        'Selections to determine sentence inclusion are not valid question options.',
      );
    }
  }

  /**
   * Create plain text sentences
   * @param plain_text  array of plain text sentence templates
   */
  async batchCreatePlainText(plain_text: string[]): Promise<number> {
    const savedResults = await this.sentenceRepository.save(
      plain_text.map((sentence) => ({
        template: sentence,
        isPlainText: true,
        isMultiQuestion: false,
        includeIfSelectedOptions: [],
        question: undefined,
      })),
    );
    return savedResults ? savedResults.length : 0;
  }

  async batchCreateQuestions(questionData: UploadQuestionData[]): Promise<number> {
    // Validate include_if_selected_options are in options
    questionData.forEach((q, index) => {
      this.validateIncludeIfSelectedOptions(
        q.include_if_selected_options,
        q.options,
        `Question ${index}`,
      );
    });

    // Create questions
    const questions = await this.questionRepository.save(
      questionData.map((q) => this.questionRepository.create({ text: q.text })),
    );

    // Create options for all questions
    const allOptions = questionData.flatMap((q, index) =>
      q.options.map((optionText) =>
        this.optionRepository.create({
          text: optionText,
          question: questions[index],
        }),
      ),
    );
    await this.optionRepository.save(allOptions);

    // Create sentences
    const sentences = await this.sentenceRepository.save(
      questionData.map((q, index) =>
        this.sentenceRepository.create({
          template: q.sentence_template,
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: q.include_if_selected_options,
          question: questions[index],
        }),
      ),
    );

    // Update questions with sentence references
    questions.forEach((question, index) => {
      if (question && sentences[index]) {
        question.sentence = sentences[index];
      }
    });

    await this.questionRepository.save(questions.filter((q) => q));

    return questionData.length;
  }

  async batchCreateMultiQuestions(multiQuestionData: UploadMultiQuestionData[]): Promise<number> {
    // Validate include_if_selected_options are in options
    multiQuestionData.forEach((multiQuestion, multiIndex) => {
      for (let i = 0; i < multiQuestion.question_texts.length; i++) {
        const optionList = multiQuestion.options[i];
        const includeIfSelected = multiQuestion.include_if_selected_option[i];

        this.validateIncludeIfSelectedOptions(
          [includeIfSelected],
          optionList,
          `Multi-question ${multiIndex}, sub-question ${i}`,
        );
      }
    });

    let numCreatedSentences = 0;

    for (const questionInfo of multiQuestionData) {
      for (let i = 0; i < questionInfo.question_texts.length; i++) {
        const questionText = questionInfo.question_texts[i];
        const fragmentText = questionInfo.fragment_texts[i];
        const optionList = questionInfo.options[i];
        const includeIfSelected = questionInfo.include_if_selected_option[i];

        // save question
        const question = await this.questionRepository.save({
          text: questionText,
        });

        // save options
        optionList.map(
          async (optionText) =>
            await this.optionRepository.save({
              question: question,
              text: optionText,
            }),
        );

        // save sentences
        // note: sentence should not have template and multitemplate
        const sentence = await this.sentenceRepository.save({
          template: questionInfo.sentence_template,
          isPlainText: false,
          isMultiQuestion: true,
          question: question,
        });

        // save fragment
        await this.fragmentRepository.save({
          text: fragmentText,
          sentence: sentence,
          question: question,
          includeIfSelectedOption: includeIfSelected,
        });

        // update sentence reference in question
        question.sentence = sentence;
        await this.questionRepository.save(question);
      }

      numCreatedSentences++;
    }

    return numCreatedSentences;
  }
}
