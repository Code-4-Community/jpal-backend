import { Question } from '../../question/types/question.entity';
import { Column, Entity, OneToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Fragment } from '../../fragment/types/fragment.entity';

@Entity()
export class Sentence {
  // optional for creation
  @PrimaryGeneratedColumn()
  id?: number;

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

  @OneToMany(() => Fragment, (fragment) => fragment.sentence)
  fragments: Fragment[];
}
