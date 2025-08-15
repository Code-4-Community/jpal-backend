import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Paragraph } from '../paragraph/types/paragraph.entity';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from '../sentence/types/sentence.entity';

export default class CreateParagraphs implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const surveyTemplate = await connection.getRepository(SurveyTemplate).findOneOrFail(1);

    const sentences = await connection.getRepository(Sentence).findByIds([1, 2]);

    await connection.getRepository(Paragraph).save([
      {
        surveyTemplate: surveyTemplate,
        order: 1,
        sentences: [sentences[0]],
      },
      {
        surveyTemplate: surveyTemplate,
        order: 2,
        sentences,
      },
    ]);
  }
}
