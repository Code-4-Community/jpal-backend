import { Question } from '../../question/types/question.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

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
}
