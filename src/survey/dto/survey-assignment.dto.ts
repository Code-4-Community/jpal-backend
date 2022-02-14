// from survey-assignment.dto.ts on the frontend:
export interface SurveyData {
  reviewer: Reviewer;
  controlYouth: Youth[];
  treatmentYouth: Youth[];
  questions: Question[];
}

export interface Question {
  question: string;
  options: string[];
}

export interface Youth extends PersonInfo {
  assignmentUuid: string;
}

export type Reviewer = PersonInfo;

interface PersonInfo {
  email: string;
  firstName: string;
  lastName: string;
}
