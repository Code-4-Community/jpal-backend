import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/types/user.entity';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';
import { Assignment } from 'src/assignment/types/assignment.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => SurveyTemplate)
  surveyTemplate: SurveyTemplate;

  @ManyToOne(() => User)
  creator: User;

  @Column()
  name: string;

  @OneToMany(() => Assignment, (assignment) => assignment.survey)
  assignments: Assignment[];
}
