import { Option } from '../../option/types/option.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, OneToOne, JoinTable, ManyToMany } from 'typeorm';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';
import { Sentence } from '../../sentence/types/sentence.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Question {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  text: string;

  @Exclude()
  @ApiHideProperty()
  @OneToMany(() => Option, (option) => option.question, {
    cascade: true,
  })
  options: Option[];

  @Exclude()
  @ApiHideProperty()
  @OneToOne(() => Sentence, (sentence) => sentence.question, {
    cascade: true,
  })
  sentence: Sentence;
}