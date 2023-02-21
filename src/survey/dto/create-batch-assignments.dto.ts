import { YouthRoles } from "src/youth/types/youthRoles";

type PersonInfo = {
  role: YouthRoles;
  email: string;
  firstName: string;
  lastName: string;
};

export interface CreateBatchAssignmentsDto {
  surveyUUID: string;
  pairs: {
    youth: PersonInfo;
    reviewer: PersonInfo;
  }[];
}
