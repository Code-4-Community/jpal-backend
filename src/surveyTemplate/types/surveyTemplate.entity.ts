import { Column, Entity, JoinTable, ManyToOne, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/types/user.entity';
import { Question } from '../../question/types/question.entity';
import { Paragraph } from 'src/paragraph/types/paragraph.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';


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
}
