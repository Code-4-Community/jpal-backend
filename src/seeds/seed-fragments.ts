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
          question: findQuestionByText(
            'Was {subject} good at responding to constructive criticism?',
          ),
        },
        {
          text: 'is responsible',
          includeIfSelectedOption: 'Yes',
          sentence: findSentenceByTemplate('{qualities}'),
          question: findQuestionByText('Was {subject} responsible?'),
        },
      ])
      .execute();
  }
}
