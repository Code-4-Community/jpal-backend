import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Assignment } from '../../assignment/types/assignment.entity';
import { Option } from '../../option/types/option.entity';
import { Question } from '../../question/types/question.entity';

@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => Option)
  option: Option;

  @ManyToOne(() => Assignment, (assignment) => assignment.responses)
  assignment: Assignment;
}
