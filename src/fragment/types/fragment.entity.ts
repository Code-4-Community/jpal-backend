import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Question } from '../../question/types/question.entity';
import { Sentence } from '../../sentence/types/sentence.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Fragment {
  @ApiHideProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiHideProperty()
  @Column()
  text: string;

  @ApiHideProperty()
  @ManyToOne(() => Sentence)
  sentence: Sentence;

  @ApiHideProperty()
  @ManyToOne(() => Question)
  question: Question;

  @ApiHideProperty()
  @Column()
  includeIfSelectedOption: string;
}
