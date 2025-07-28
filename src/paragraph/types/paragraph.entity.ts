import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Sentence } from 'src/sentence/types/sentence.entity';
import { SurveyTemplate } from 'src/surveyTemplate/types/surveyTemplate.entity';

@Entity()
export class Paragraph {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @ManyToOne(() => SurveyTemplate, (template) => template.paragraphs)
  template: SurveyTemplate;

  @ManyToMany(() => Sentence)
  @JoinTable()
  sentences: Sentence[];
}
