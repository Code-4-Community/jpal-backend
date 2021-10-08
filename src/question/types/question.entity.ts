import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SurveyTemplate } from '../../survey-template/types/survey-template.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SurveyTemplate, (surveyTemplate) => surveyTemplate.questions)
  surveyTemplate: SurveyTemplate;

  @Column()
  text: string;
}
