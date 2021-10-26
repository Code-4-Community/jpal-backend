type ReviewerOrYouth = {
  email: string;
  firstName: string;
  lastName: string;
};

export interface CreateBatchAssignmentsDto {
  surveyId: number;
  pairs: {
    youth: ReviewerOrYouth;
    reviewer: ReviewerOrYouth;
  }[];
}
