import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/types/user.entity';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';
import { Assignment } from '../../assignment/types/assignment.entity';
@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  organizationName: string;

  @Column({ nullable: true })
  imageURL: string | null;

  @ManyToOne(() => SurveyTemplate)
  surveyTemplate: SurveyTemplate;

  @ManyToOne(() => User)
  creator: User;

  @Column()
  name: string;

  @OneToMany(() => Assignment, (assignment) => assignment.survey, {
    cascade: true,
  })
  assignments: Assignment[];

  @CreateDateColumn()
  date: Date;
}
