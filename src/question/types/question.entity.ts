import { Option } from '../../option/types/option.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SurveyTemplate, (surveyTemplate) => surveyTemplate.questions)
  surveyTemplate: SurveyTemplate;

  @Column()
  text: string;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: true,
  })
  options: Option[];
}
