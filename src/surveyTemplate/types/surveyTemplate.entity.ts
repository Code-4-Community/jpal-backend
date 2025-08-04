import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/types/user.entity';
import { Question } from '../../question/types/question.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Paragraph } from '../../paragraph/types/paragraph.entity';

@Entity()
export class SurveyTemplate {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne(() => User)
  creator: User;

  @ApiHideProperty()
  @ManyToMany(() => Question)
  @JoinTable()
  questions: Question[];

  @ApiProperty()
  @Column()
  name: string;

  @Column()
  greeting: string;

  @Column()
  closing: string;

  @OneToMany(() => Paragraph, (paragraph) => paragraph.template, {
    cascade: true,
  })
  paragraphs: Paragraph[];
}
