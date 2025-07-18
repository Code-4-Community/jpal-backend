import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Question } from '../../question/types/question.entity';

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

  @Column()
  includeIfSelectedOptions: string[]

  @OneToOne(() => Sentence, { cascade: true, eager: true }) // optional: cascade and eager load
  @JoinColumn()
  sentence: Sentence;
}