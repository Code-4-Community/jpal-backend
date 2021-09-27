import { Controller, Get } from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Role } from "src/users/types/role";

@Controller('assignment')
export class AssignmentController {
    constructor(private assignmentService: AssignmentService) {}

    /**
     * Returns all surveys by the currently logged in user
     */
    @Get()
    @Auth(Role.ADMIN | Role.RESEARCHER)
    getAllSurveys(): Promise<Assignment[]> {
        return this.surveyService.getAllSurveys();
    }
    
}