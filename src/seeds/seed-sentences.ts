import { Sentence } from '../sentence/types/sentence.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateSentences implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const questions = await connection.getRepository('question').findByIds([3]);

    await connection
      .createQueryBuilder()
      .insert()
      .into(Sentence)
      .values([
        {
          template: '{youth} {qualifier} finished work on time.',
          isPlainText: false,
          isMultiQuestion: false,
          includeIfSelectedOptions: ['always', 'usually'],
          question: questions[0],
        },
        {
          template: '{youth} worked for me at {location}.',
          isPlainText: true,
          isMultiQuestion: false,
          includeIfSelectedOptions: [],
        },
      ])
      .execute();
  }
}
