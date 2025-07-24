import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { Question } from '../../question/types/question.entity';
import { Fragment } from 'src/fragment/types/fragment.entity';

@Entity()
export class Sentence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  template: string;

  @Column()
  multiTemplate?: string;

  @Column()
  isPlainText: boolean;

  @Column()
  isMultiQuestion: boolean;

  @Column('text', { array: true, default: () => "'{}'" })
  includeIfSelectedOptions: string[];

  @OneToOne(() => Question, (question: Question) => question.sentence)
  @JoinColumn()
  question: Question;
}
