import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Sentence } from '../../sentence/types/sentence.entity';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';

@Entity()
export class Paragraph {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @ManyToOne(() => SurveyTemplate)
  surveyTemplate: SurveyTemplate;

  @ManyToMany(() => Sentence)
  @JoinTable({ name: 'paragraph_sentences' })
  sentences: Sentence[];
}
