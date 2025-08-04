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
  @ApiHideProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiHideProperty()
  @Column()
  order: number;

  @ApiHideProperty()
  @ManyToOne(() => SurveyTemplate)
  template: SurveyTemplate;

  @ApiHideProperty()
  @ManyToMany(() => Sentence)
  @JoinTable()
  sentences: Sentence[];
}
