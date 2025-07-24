import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Question } from '../../question/types/question.entity';
import { Sentence } from 'src/sentence/types/sentence.entity';

@Entity()
export class Fragment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Sentence)
  sentence: Sentence;

  @ManyToOne(() => Question)
  question: Question;


  @Column('text', { array: true, default: () => "'{}'" })
  includeIfSelectedOptions: string[];
}
