import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/types/user.entity';
import { Question } from '../../question/types/question.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Paragraph } from '../../paragraph/types/paragraph.entity';

@Entity()
export class SurveyTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  creator: User;

  @ManyToMany(() => Question)
  @JoinTable({
    name: 'question_surveytemplate',
  })
  questions: Question[];

  @Column()
  name: string;

  @Column()
  greeting: string;

  @Column()
  closing: string;

  @OneToMany(() => Paragraph, (paragraph) => paragraph.template, {
    cascade: true,
  })
  paragraphs: Paragraph[];
}
