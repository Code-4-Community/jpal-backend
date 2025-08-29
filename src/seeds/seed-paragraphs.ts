import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Paragraph } from '../paragraph/types/paragraph.entity';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from '../sentence/types/sentence.entity';

export default class CreateParagraphs implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const surveyTemplate = await connection.getRepository(SurveyTemplate).findOneOrFail(1);

    const sentences = await connection
      .getRepository(Sentence)
      .findByIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    await connection.getRepository(Paragraph).save([
      {
        surveyTemplate: surveyTemplate,
        order: 1,
        sentences: [sentences[8], sentences[0]],
      },
      {
        surveyTemplate: surveyTemplate,
        order: 2,
        sentences: [sentences[2]],
      },
      {
        surveyTemplate: surveyTemplate,
        order: 3,
        sentences: [sentences[3], sentences[4]],
      },
      {
        surveyTemplate: surveyTemplate,
        order: 4,
        sentences: [sentences[5]],
      },
      {
        surveyTemplate: surveyTemplate,
        order: 5,
        sentences: [sentences[6], sentences[9], sentences[7]],
      },
    ]);
  }
}
