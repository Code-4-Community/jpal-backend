import { Option } from '../../option/types/option.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from '../../sentence/types/sentence.entity';

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

  @OneToOne(() => Sentence, (sentence: Sentence) => sentence.question, {
    cascade: true,
  })
  sentence: Sentence;
}
