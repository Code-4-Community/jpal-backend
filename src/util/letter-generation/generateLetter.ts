import { SurveyResponseDto } from '../../assignment/dto/survey-response.dto';
import { Assignment } from '../../assignment/types/assignment.entity';
import { Survey } from '../../survey/types/survey.entity';
import { SurveyTemplate } from '../../surveyTemplate/types/surveyTemplate.entity';

export type Letter = {
  shouldBeSent: boolean;
  date: Date;
  greeting: string;
  paragraphs: string[];
  closing: string;
  signature: {
    fullName: string;
    organization: string;
  };
};

/**
 * All the relevant metadata for an assignment in a nicer format.
 */
export type AssignmentMetaData = {
  youth: {
    firstName: string;
    lastName: string;
    fullName: string;
  };
  reviewer: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
  };
  organization: string;
  dateOfLetterGeneration: Date;
  survey: Survey;
  surveyTemplate: SurveyTemplate;
};

export type LetterGenerationRules = {
  greeting: (params: { metaData: AssignmentMetaData }) => string;
  paragraphs: ({
    metaData,
    responses,
  }: {
    metaData: AssignmentMetaData;
    responses: SurveyResponseDto[];
  }) => string[];
  closing: (params: { metaData: AssignmentMetaData }) => string;
};

export default function generateLetter(
  responses: SurveyResponseDto[],
  metadata: AssignmentMetaData,
  rules: LetterGenerationRules,
): Letter {
  const generatedParagraphs = rules.paragraphs({ metaData: metadata, responses });
  return {
    shouldBeSent: generatedParagraphs.length >= 3,
    date: metadata.dateOfLetterGeneration,
    greeting: rules.greeting({ metaData: metadata }),
    paragraphs: generatedParagraphs,
    closing: rules.closing({ metaData: metadata }),
    signature: {
      fullName: getFullName(metadata.reviewer.firstName, metadata.reviewer.lastName),
      organization: metadata.organization,
    },
  };
}

export function extractMetaData(assignment: Assignment, currentDate: Date): AssignmentMetaData {
  return {
    youth: {
      firstName: assignment.youth.firstName,
      lastName: assignment.youth.lastName,
      fullName: getFullName(assignment.youth.firstName, assignment.youth.lastName),
    },
    reviewer: {
      firstName: assignment.reviewer.firstName,
      lastName: assignment.reviewer.lastName,
      fullName: getFullName(assignment.reviewer.firstName, assignment.reviewer.lastName),
      email: assignment.reviewer.email,
    },
    organization: assignment.survey.organizationName,
    dateOfLetterGeneration: currentDate,
    survey: assignment.survey,
    surveyTemplate: assignment.survey.surveyTemplate,
  };
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
