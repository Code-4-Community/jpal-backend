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
import { ApiHideProperty } from '@nestjs/swagger';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from '../../sentence/types/sentence.entity';

@Entity()
export class Paragraph {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @ManyToOne(() => SurveyTemplate)
  template: SurveyTemplate;

  @ManyToMany(() => Sentence)
  @JoinTable()
  sentences: Sentence[];
}
