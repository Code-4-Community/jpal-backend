import { Question } from '../../question/types/question.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Sentence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  template: string;

  @Column({ nullable: true })
  multiTemplate?: string;

  @Column()
  isPlainText: boolean;

  @Column({ nullable: true })
  isMultiQuestion: boolean;

  @Column('text', { array: true, default: () => "'{}'" })
  includeIfSelectedOptions: string[];

  @OneToOne(() => Question, (question) => question.sentence)
  @JoinColumn()
  question: Question;
}
