import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/types/user.entity';
import { Question } from '../../question/types/question.entity';
import { Paragraph } from '../../paragraph/types/paragraph.entity';

@Entity()
export class SurveyTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  creator: User;

  @ManyToMany(() => Question)
  @JoinTable({ name: 'question_surveytemplate' })
  questions: Question[];

  @Column()
  name: string;

  @Column()
  greeting: string;

  @Column()
  closing: string;

  @OneToMany(() => Paragraph, (paragraph) => paragraph.surveyTemplate, {
    cascade: true,
  })
  paragraphs: Paragraph[];
}
