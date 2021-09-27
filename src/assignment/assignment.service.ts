import { Injectable } from "@nestjs/common";
import { Assignment }


@Injectable()
export class AssignmentService {
    constructor(
        @InjectRepository(Assignment) private assignmentRepository: Repository<Assignment>,
        private awsCreateAssignment: AwsCreateUserAssignment,
    ) {}


}