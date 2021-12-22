import { Column, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Response } from '../../response/types/response.entity';
import { Reviewer } from '../../reviewer/types/reviewer.entity';
import { Survey } from '../../survey/types/survey.entity';
import { Youth } from '../../youth/types/youth.entity';
import { AssignmentStatus } from './assignmentStatus';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => Survey)
  survey: Survey;

  @ManyToOne(() => Reviewer)
  reviewer: Reviewer;

  @ManyToOne(() => Youth)
  youth: Youth;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.INCOMPLETE,
  })
  status: AssignmentStatus;

  @OneToMany(() => Response, (response) => response.assignment)
  responses: Response[];
}
