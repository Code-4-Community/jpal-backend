import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/types/user.entity';
import { Reviewer } from '../../reviewer/types/reviewer.entity';
import { Youth } from '../../youth/types/youth.entity';
import { SurveyTemplate } from '../../survey-template/types/survey-template.entity';
import { Response } from '../../response/types/response.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SurveyTemplate)
  surveyTemplate: SurveyTemplate;

  @ManyToOne(() => Reviewer)
  reviewer: Reviewer;

  @ManyToOne(() => Youth)
  youth: Youth;

  @Column({
    default: false,
  })
  completed: boolean;

  @ManyToOne(() => User)
  creator: User;

  @Column()
  name: string;

  @OneToMany(() => Response, (response) => response.assignment)
  responses: Response[];
}
