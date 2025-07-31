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
import { ApiHideProperty } from '@nestjs/swagger';

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
