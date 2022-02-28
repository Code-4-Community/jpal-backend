import { Response } from '../../../src/response/types/response.entity';
import { Assignment } from '../../assignment/types/assignment.entity';

export type Letter = {
  date: Date;
  greeting: string;
  paragraphs: string[];
  closing: string;
  signature: {
    fullName: string;
    organization: string;
  };
};

// TODO: Use this
export enum QuestionType {
  // Paragraph 1
  OVERALL_PERFORMANCE,
  // Paragraph 2
  ON_TIME_TO_WORK,
  COMPLETED_TASKS_TIMELY,
  // Paragraph 3
  EFFECTIVE_COMMUNICATOR,
  GOOD_AT_FOLLOWING_INSTRUCTIONS,
  // Paragraph 4
  STRENGTHS,
  // Paragraph 5
  WOULD_HIRE_FULL_TIME,
  WOULD_ACT_AS_REFERRAL,
}

/**
 * All the relevant metadata for an assignment in a nicer format.
 */
type AssignmentMetaData = {
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
};

export type LetterGenerationRules = {
  greeting: string;
  paragraphs: Paragraph[];
  closing: string;
};

type Paragraph = {
  sentences: Sentence[];
};

type Sentence = SentenceFactory | SentenceConversionRules;

type SentenceFactory = (metadata: AssignmentMetaData) => string;

type SentenceConversionRules = {
  toSentence: (selectedOption: string, metadata: AssignmentMetaData) => string;
  selectResponse: (responses: Response[]) => Response | undefined;
  shouldIncludeSentence: (response: Response) => boolean;
};

export default function generateLetter(
  assignment: Assignment,
  rules: LetterGenerationRules,
  currentDate: Date = new Date(),
): Letter {
  const metadata = extractMetaData(assignment);

  return {
    date: currentDate,
    greeting: rules.greeting,
    paragraphs: rules.paragraphs
      .map((paragraphRules) => generateParagraph(paragraphRules, assignment.responses, metadata))
      .filter((paragraph) => paragraph !== undefined),
    closing: rules.closing,
    signature: {
      fullName: getFullName(metadata.reviewer.firstName, metadata.reviewer.lastName),
      organization: metadata.organization,
    },
  };
}

function generateParagraph(
  paragraphRules: Paragraph,
  responses: Response[],
  metadata: AssignmentMetaData,
): string | undefined {
  const sentences: string[] = paragraphRules.sentences
    .map((sentence) => generateSentence(sentence, responses, metadata))
    .filter((sentence) => sentence !== undefined);

  return sentences.length > 0 ? sentences.join(' ') : undefined;
}

/**
 * @param sentence May be a literal sentence or a collection of rules to create one, if the latter, then generates the sentence
 * @returns The sentence, or undefined if the sentence should not be included
 */
function generateSentence(
  sentence: Sentence,
  responses: Response[],
  metadata: AssignmentMetaData,
): string | undefined {
  if (typeof sentence === 'function') {
    return sentence(metadata);
  } else {
    const response = sentence.selectResponse(responses);
    if (response === undefined) {
      return undefined;
    } else {
      return sentence.toSentence(response.option.text, metadata);
    }
  }
}

function extractMetaData(assignment: Assignment): AssignmentMetaData {
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
    organization: 'The Wharton School', // TODO: Add organization to the assignment entity
    dateOfLetterGeneration: new Date(),
  };
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
