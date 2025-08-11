import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/types/user.entity';
import { Question } from '../../question/types/question.entity';
import { Paragraph } from '../../paragraph/types/paragraph.entity';

@Entity()
export class SurveyTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  creator: User;

  @OneToMany(() => Question, (question) => question.surveyTemplate, {
    cascade: true,
  })
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
