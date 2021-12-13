import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reviewer } from '../../reviewer/types/reviewer.entity';
import { Youth } from '../../youth/types/youth.entity';
import { Response } from '../../response/types/response.entity';
import { Survey } from '../../survey/types/survey.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @ManyToOne(() => Survey)
  survey: Survey;

  @ManyToOne(() => Reviewer)
  reviewer: Reviewer;

  @ManyToOne(() => Youth)
  youth: Youth;

  @Column({
    default: false,
  })
  completed: boolean;

  @OneToMany(() => Response, (response) => response.assignment)
  responses: Response[];
}
