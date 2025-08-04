import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { SurveyTemplate } from '../surveyTemplate/types/surveyTemplate.entity';
import { Question } from '../question/types/question.entity';
import { User } from '../user/types/user.entity';

export default class CreateSurveyTemplates implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRepo = connection.getRepository(User);
    const questionRepo = connection.getRepository(Question);
    const surveyTemplateRepo = connection.getRepository(SurveyTemplate);

    // Fetch the user
    const user = await userRepo.findOne({ id: 1 });
    if (!user) throw new Error('User with id 1 not found');

    // Fetch all questions (or a subset based on your criteria)
    const questions = await questionRepo.find(); // Or use `.findBy()` or `.find({ where: ... })` to filter

    const surveyTemplate = surveyTemplateRepo.create({
      creator: user,
      name: 'Survey Temp 1',
      greeting: 'To Whom It May Concern',
      closing: 'Sincerely',
      questions: questions, // Associate all existing questions
    });

    await surveyTemplateRepo.save(surveyTemplate);
  }
}
