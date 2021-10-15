// import { Controller, Get } from "@nestjs/common";
// import { Auth } from "src/auth/decorators/auth.decorator";
// import { ReqUser } from "src/auth/decorators/user.decorator";
// import { Role } from "src/user/types/role";
// import { User } from "src/user/types/user.entity";
// import { AssignmentService } from "./assignment.service";
// import { Assignment } from "./types/assignment.entity";

// @Controller('assignment')
// export class AssignmentController {
//     constructor(private assignmentService: AssignmentService) {}

//     /**
//      * Returns all assignments by the currently logged in user
//      */
//     @Get()
//     @Auth(Role.ADMIN || Role.RESEARCHER)
//     getAllAssignments(@ReqUser() user: User): Promise<Assignment[]> {

//         return this.assignmentService.getAllAssignments(user);
//     }

// }
