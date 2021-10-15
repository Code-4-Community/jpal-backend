import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/types/user.entity';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SurveyTemplate)
  surveyTemplate: SurveyTemplate;

  @ManyToOne(() => User)
  creator: User;

  @Column()
  name: string;
}
