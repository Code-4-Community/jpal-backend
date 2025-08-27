import { Question } from '../question/types/question.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateSentences implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Get all questions - you'll need to adjust the IDs based on your actual question IDs
    const questions = await connection.getRepository('question').find();

    // Helper function to find question by text
    const findQuestionByText = (text: string) => {
      return questions.find((q: Question) => q.text === text);
    };

    await connection
      .createQueryBuilder()
      .insert()
      .into(Sentence)
      .values([
        // Overall rating sentence
        {
          template: 'Overall, {subject} was a {rating} employee.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: [
            'Very poor',
            'Poor',
            'Neutral',
            'Good',
            'Very good',
            'Excellent',
            'Exceptional',
          ],
          question: findQuestionByText('Overall, how would you rate {subject} as an employee?'),
        },

        // Punctuality sentence
        {
          template: '{subject} {frequency} arrived on time for work.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Sometimes', 'Usually', 'Almost Always', 'Always'],
          question: findQuestionByText('How often did {subject} arrive on time for work?'),
        },

        // Task completion sentence
        {
          template: '{subject} {frequency} completed work-related tasks in a timely manner.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Sometimes', 'Usually', 'Almost Always', 'Always'],
          question: findQuestionByText(
            'How often did {subject} complete work-related tasks in a timely manner?',
          ),
        },

        // Communication sentence
        {
          template: '{subject} was {effectiveness} at communicating.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: [
            'Somewhat effective',
            'Effective',
            'Very effective',
            'Incredibly effective',
          ],
          question: findQuestionByText('How was {subject} at communicating?'),
        },

        // Following instructions sentence
        {
          template: '{subject} was {quality} at following instructions.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Neutral', 'Good', 'Very good', 'Excellent'],
          question: findQuestionByText('How was {subject} at following instructions?'),
        },

        // Multi-quality sentence for positive traits
        {
          template: "In addition to {subject}'s other strengths, {subject} {qualities}.",
          multiTemplate: `In addition to {subject}\'s other strengths, {subject} {qualities}.`,
          isPlainText: false,
          isMultiQuestion: true,
          includeIfSelectedOptions: ['Yes'], // Will be populated based on multiple Yes answers
          question: findQuestionByText('Did {subject} take initiative?'), // Primary question for this multi-sentence
        },

        // Hiring recommendation sentence
        {
          template:
            'Given enough resources, I would {recommendation} {subject} as a regular employee.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Yes', 'No'],
          question: findQuestionByText(
            'Given enough resources, would you hire {subject} as a regular employee?',
          ),
        },

        // Reference willingness sentence
        {
          template: 'I {willingness} to act as a reference for {subject}. {contact}',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Yes', 'No'],
          question: findQuestionByText(
            "Would you be willing to act as a reference for {subject}? We will include your email address as contact information if you respond 'Yes'.",
          ),
        },

        // Plain text sentences (context/background)
        {
          template: '{subject} worked for me at {organization} during {timeframe}.',
          isPlainText: true,
          isMultiQuestion: false,
          includeIfSelectedOptions: [],
        },

        // Closing sentence for contact
        {
          template: 'I invite you to contact me if you would like more information.',
          isPlainText: true,
          isMultiQuestion: false,
          includeIfSelectedOptions: [],
        },
      ])
      .execute();
  }
}
