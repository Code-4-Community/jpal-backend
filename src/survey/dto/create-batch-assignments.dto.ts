type PersonInfo = {
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
