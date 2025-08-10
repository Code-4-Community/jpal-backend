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
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from '../../sentence/types/sentence.entity';

@Entity()
export class Paragraph {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @ManyToOne(() => SurveyTemplate, (template) => template.paragraphs)
  surveyTemplate: SurveyTemplate;

  @ManyToMany(() => Sentence)
  @JoinTable({ name: 'paragraph_sentences' })
  sentences: Sentence[];
}
