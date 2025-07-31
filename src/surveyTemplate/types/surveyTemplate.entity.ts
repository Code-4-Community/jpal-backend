import { Column, Entity, JoinTable, ManyToOne, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/types/user.entity';
import { Question } from '../../question/types/question.entity';
import { Paragraph } from 'src/paragraph/types/paragraph.entity';
import { ApiHideProperty } from '@nestjs/swagger';


@Entity()
export class SurveyTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  creator: User;

  @ApiHideProperty()
  @ManyToMany(() => Question)
  @JoinTable()
  questions: Question[];

  @Column()
  name: string;
}
