import { Option } from '../../option/types/option.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Sentence } from '../../sentence/types/sentence.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: true,
  })
  options: Option[];

  @OneToOne(() => Sentence, (sentence) => sentence.question, {
    cascade: true,
  })
  sentence: Sentence;
}
