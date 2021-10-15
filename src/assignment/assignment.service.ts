import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/types/user.entity";
import { Repository } from "typeorm";
import { Assignment } from "./types/assignment.entity";



@Injectable()
export class AssignmentService {
    constructor(
        @InjectRepository(Assignment) private assignmentRepository: Repository<Assignment>,
    ) {}

    /**
     * gets all assignments created by the current user
     */
    
    async getAllAssignments(user : User): Promise<Assignment[]> {
        return this.assignmentRepository.find({}
            )

    }


}