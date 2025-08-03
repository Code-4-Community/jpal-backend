import { Question } from '../../question/types/question.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Sentence {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  template: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  multiTemplate?: string;

  @ApiProperty()
  @Column()
  isPlainText: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  isMultiQuestion: boolean;

  @ApiProperty()
  @Column('text', { array: true, default: () => "'{}'" })
  includeIfSelectedOptions: string[];

  @Exclude()
  @ApiHideProperty()
  @OneToOne(() => Question, (question) => question.sentence)
  @JoinColumn()
  question: Question;
}
