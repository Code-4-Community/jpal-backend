import { Sentence } from '../sentence/types/sentence.entity';
import { Fragment } from '../fragment/types/fragment.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Question } from '../question/types/question.entity';

export default class CreateFragments implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Get sentences and questions for relationships
    const sentences = await connection.getRepository('sentence').find();
    const questions = await connection.getRepository('question').find();
    
    // Helper functions to find entities
    const findSentenceByTemplate = (templatePart: string) => {
      return sentences.find((s: Sentence) => s.template.includes(templatePart));
    };
    
    const findQuestionByText = (text: string) => {
      return questions.find((q: Question) => q.text === text);
    };

    await connection
      .createQueryBuilder()
      .insert()
      .into(Fragment)
      .values([
        // Overall rating fragments
        {
          text: 'very poor',
          includeIfSelectedOption: 'Very poor',
          sentence: findSentenceByTemplate('{rating}'),
          question: findQuestionByText('Overall, how would you rate {subject} as an employee?'),
        },
        {
          text: 'poor',
          includeIfSelectedOption: 'Poor',
          sentence: findSentenceByTemplate('{rating}'),
          question: findQuestionByText('Overall, how would you rate {subject} as an employee?'),
        },
        {
          text: 'adequate',
          includeIfSelectedOption: 'Neutral',
          sentence: findSentenceByTemplate('{rating}'),
          question: findQuestionByText('Overall, how would you rate {subject} as an employee?'),
        },
        {
          text: 'good',
          includeIfSelectedOption: 'Good',
          sentence: findSentenceByTemplate('{rating}'),
          question: findQuestionByText('Overall, how would you rate {subject} as an employee?'),
        },
        {
          text: 'very good',
          includeIfSelectedOption: 'Very good',
          sentence: findSentenceByTemplate('{rating}'),
          question: findQuestionByText('Overall, how would you rate {subject} as an employee?'),
        },
        {
          text: 'excellent',
          includeIfSelectedOption: 'Excellent',
          sentence: findSentenceByTemplate('{rating}'),
          question: findQuestionByText('Overall, how would you rate {subject} as an employee?'),
        },
        {
          text: 'exceptional',
          includeIfSelectedOption: 'Exceptional',
          sentence: findSentenceByTemplate('{rating}'),
          question: findQuestionByText('Overall, how would you rate {subject} as an employee?'),
        },

        // Frequency fragments for punctuality
        {
          text: 'sometimes',
          includeIfSelectedOption: 'Sometimes',
          sentence: findSentenceByTemplate('arrived on time'),
          question: findQuestionByText('How often did {subject} arrive on time for work?'),
        },
        {
          text: 'usually',
          includeIfSelectedOption: 'Usually',
          sentence: findSentenceByTemplate('arrived on time'),
          question: findQuestionByText('How often did {subject} arrive on time for work?'),
        },
        {
          text: 'almost always',
          includeIfSelectedOption: 'Almost Always',
          sentence: findSentenceByTemplate('arrived on time'),
          question: findQuestionByText('How often did {subject} arrive on time for work?'),
        },
        {
          text: 'always',
          includeIfSelectedOption: 'Always',
          sentence: findSentenceByTemplate('arrived on time'),
          question: findQuestionByText('How often did {subject} arrive on time for work?'),
        },

        // Frequency fragments for task completion
        {
          text: 'sometimes',
          includeIfSelectedOption: 'Sometimes',
          sentence: findSentenceByTemplate('completed work-related tasks'),
          question: findQuestionByText('How often did {subject} complete work-related tasks in a timely manner?'),
        },
        {
          text: 'usually',
          includeIfSelectedOption: 'Usually',
          sentence: findSentenceByTemplate('completed work-related tasks'),
          question: findQuestionByText('How often did {subject} complete work-related tasks in a timely manner?'),
        },
        {
          text: 'almost always',
          includeIfSelectedOption: 'Almost Always',
          sentence: findSentenceByTemplate('completed work-related tasks'),
          question: findQuestionByText('How often did {subject} complete work-related tasks in a timely manner?'),
        },
        {
          text: 'always',
          includeIfSelectedOption: 'Always',
          sentence: findSentenceByTemplate('completed work-related tasks'),
          question: findQuestionByText('How often did {subject} complete work-related tasks in a timely manner?'),
        },

        // Communication effectiveness fragments
        {
          text: 'somewhat effective',
          includeIfSelectedOption: 'Somewhat effective',
          sentence: findSentenceByTemplate('{effectiveness} at communicating'),
          question: findQuestionByText('How was {subject} at communicating?'),
        },
        {
          text: 'effective',
          includeIfSelectedOption: 'Effective',
          sentence: findSentenceByTemplate('{effectiveness} at communicating'),
          question: findQuestionByText('How was {subject} at communicating?'),
        },
        {
          text: 'very effective',
          includeIfSelectedOption: 'Very effective',
          sentence: findSentenceByTemplate('{effectiveness} at communicating'),
          question: findQuestionByText('How was {subject} at communicating?'),
        },
        {
          text: 'incredibly effective',
          includeIfSelectedOption: 'Incredibly effective',
          sentence: findSentenceByTemplate('{effectiveness} at communicating'),
          question: findQuestionByText('How was {subject} at communicating?'),
        },

        // Following instructions fragments
        {
          text: 'adequate',
          includeIfSelectedOption: 'Neutral',
          sentence: findSentenceByTemplate('{quality} at following instructions'),
          question: findQuestionByText('How was {subject} at following instructions?'),
        },
        {
          text: 'good',
          includeIfSelectedOption: 'Good',
          sentence: findSentenceByTemplate('{quality} at following instructions'),
          question: findQuestionByText('How was {subject} at following instructions?'),
        },
        {
          text: 'very good',
          includeIfSelectedOption: 'Very good',
          sentence: findSentenceByTemplate('{quality} at following instructions'),
          question: findQuestionByText('How was {subject} at following instructions?'),
        },
        {
          text: 'excellent',
          includeIfSelectedOption: 'Excellent',
          sentence: findSentenceByTemplate('{quality} at following instructions'),
          question: findQuestionByText('How was {subject} at following instructions?'),
        },

        // Positive trait fragments (for multi-question sentence)
        {
          text: 'takes initiative',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{qualities}'),
          question: findQuestionByText('Did {subject} take initiative?'),
        },
        {
          text: 'is trustworthy',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{qualities}'),
          question: findQuestionByText('Was {subject} trustworthy?'),
        },
        {
          text: 'is respectful',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{qualities}'),
          question: findQuestionByText('Was {subject} respectful?'),
        },
        {
          text: 'works well in teams',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{qualities}'),
          question: findQuestionByText('Did {subject} work well in teams?'),
        },
        {
          text: 'is good at responding to constructive criticism',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{qualities}'),
          question: findQuestionByText('Was {subject} good at responding to constructive criticism?'),
        },
        {
          text: 'is responsible',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{qualities}'),
          question: findQuestionByText('Was {subject} responsible?'),
        },

        // Hiring recommendation fragments
        {
          text: 'hire',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{recommendation}'),
          question: findQuestionByText('Given enough resources, would you hire {subject} as a regular employee?'),
        },
        {
          text: 'not hire',
          includeIfSelectedOption: 'No',
          sentence: findSentenceByTemplate('{recommendation}'),
          question: findQuestionByText('Given enough resources, would you hire {subject} as a regular employee?'),
        },

        // Reference willingness fragments
        {
          text: 'would be happy',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{willingness}'),
          question: findQuestionByText('Would you be willing to act as a reference for {subject}? We will include your email address as contact information if you respond \'Yes\'.'),
        },
        {
          text: 'would prefer not',
          includeIfSelectedOption: 'No',
          sentence: findSentenceByTemplate('{willingness}'),
          question: findQuestionByText('Would you be willing to act as a reference for {subject}? We will include your email address as contact information if you respond \'Yes\'.'),
        },

        // Contact information fragments
        {
          text: 'I can be reached at {contactEmail} for further information.',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{contact}'),
          question: findQuestionByText('Would you be willing to act as a reference for {subject}? We will include your email address as contact information if you respond \'Yes\'.'),
        },
        {
          text: 'Please contact me if you need additional information.',
          includeIfSelectedOption: 'No',
          sentence: findSentenceByTemplate('{contact}'),
          question: findQuestionByText('Would you be willing to act as a reference for {subject}? We will include your email address as contact information if you respond \'Yes\'.'),
        },
      ])
      .execute();
  }
}