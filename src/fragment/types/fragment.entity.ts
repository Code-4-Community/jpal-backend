import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Question } from '../../question/types/question.entity';
import { Sentence } from 'src/sentence/types/sentence.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Fragment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ApiHideProperty()
  @ManyToOne(() => Sentence)
  sentence: Sentence;

  @ApiHideProperty()
  @ManyToOne(() => Question)
  question: Question;

  @Column()
  includeIfSelectedOption: string;
}
