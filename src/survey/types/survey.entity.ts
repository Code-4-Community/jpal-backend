import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/types/user.entity';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';

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

  @CreateDateColumn()
  date: Date;
}
