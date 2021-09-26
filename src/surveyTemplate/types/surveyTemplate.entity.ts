import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/types/user.entity';
import { Question } from '../../question/types/question.entity';

@Entity()
export class SurveyTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  creator: User;

  @OneToMany(() => Question, (question) => question.surveyTemplate)
  questions: Question[];
}
