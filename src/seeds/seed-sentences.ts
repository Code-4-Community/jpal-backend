import { Question } from '../question/types/question.entity';
import { Sentence } from '../sentence/types/sentence.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateSentences implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Get all questions - you'll need to adjust the IDs based on your actual question IDs
    const questions = await connection.getRepository('question').find();
    const fragments = await connection.getRepository('fragment').findByIds([1, 2, 3, 4, 5, 6]);

    // Helper function to find question by text
    const findQuestionByText = (text: string) => {
      return questions.find((q: Question) => q.text === text);
    };

    await connection
      .createQueryBuilder()
      .insert()
      .into(Sentence)
      .values([
        {
          template:
            '{subject_first_name} {subject_last_name} worked for me at {organization_name} during this past summer.',
          isPlainText: true,
          isMultiQuestion: false,
          includeIfSelectedOptions: [],
        },
        {
          template: 'Overall, {subject_first_name} was {article_rating} employee.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Good', 'Very good', 'Excellent', 'Exceptional'],
          question: findQuestionByText('Overall, how would you rate {subject} as an employee?'),
        },
        {
          template:
            '{subject_first_name} {rating} completed work-related tasks in a timely manner.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Usually', 'Almost Always', 'Always'],
          question: findQuestionByText(
            'How often did {subject} complete work-related tasks in a timely manner?',
          ),
        },
        {
          template: '{subject_first_name} was {rating} communicator.',
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
        {
          template: '{subject_first_name} was {rating} at following instructions.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Good', 'Very good', 'Excellent'],
          question: findQuestionByText('How was {subject} at following instructions?'),
        },
        {
          template: "In addition to {subject_first_name}'s other strengths, {subject_first_name} {qualities}.",
          isPlainText: false,
          isMultiQuestion: true,
          includeIfSelectedOptions: ['Yes'],
          question: findQuestionByText('Did {subject} take initiative?'),
          fragments: fragments
        },
        {
          template: 'Given the resources, I would hire {subject_first_name} as a regular employee.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Yes'],
          question: findQuestionByText(
            'Given enough resources, would you hire {subject} as a regular employee?',
          ),
        },
        {
          template:
            'I invite you to contact me if you would like more information. I can be reached at {contact}.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['Yes'],
          question: findQuestionByText(
            "Would you be willing to act as a reference for {subject}? We will include your email address as contact information if you respond 'Yes'.",
          ),
        },
      ])
      .execute();
  }
}