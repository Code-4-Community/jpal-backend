type ReviewerOrYouth = {
  email: string;
  firstName: string;
  lastName: string;
};

export interface CreateBatchAssignmentsDto {
  surveyUUID: string;
  pairs: {
    youth: ReviewerOrYouth;
    reviewer: ReviewerOrYouth;
  }[];
}
