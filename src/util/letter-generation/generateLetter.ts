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

type Sentence = SentenceFactory | SingleResponseSentence | MultiResponseSentence;

type SentenceFactory = (metadata: AssignmentMetaData) => string;

type SingleResponseSentence = {
  toSentence: (selectedOption: string, metadata: AssignmentMetaData) => string;
  selectResponse: (responses: Response[]) => Response | undefined;
  shouldIncludeSentence: (response: Response) => boolean;
};

function isSingleResponseSentence(expr): expr is SingleResponseSentence {
  return (expr as SingleResponseSentence).toSentence !== undefined;
}

type MultiResponseSentence = {
  composeFragments: (fragments: string[], metadata: AssignmentMetaData) => string;
  fragments: Fragment[];
};

type Fragment = {
  toFragment: (selectedOption: string, metadata: AssignmentMetaData) => string;
  selectResponse: (responses: Response[]) => Response | undefined;
  shouldIncludeFragment: (response: Response) => boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isMultiResponseSentence(expr): expr is MultiResponseSentence {
  return (expr as MultiResponseSentence).composeFragments !== undefined;
}

export default function generateLetter(
  assignment: Assignment,
  rules: LetterGenerationRules,
  currentDate: Date = new Date(),
): Letter {
  const metadata = extractMetaData(assignment, currentDate);

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
  } else if (isSingleResponseSentence(sentence)) {
    const response = sentence.selectResponse(responses);
    // TODO: log if no response is found
    if (response === undefined) {
      return undefined;
    } else if (response) {
      return sentence.toSentence(response.option.text.toLowerCase(), metadata);
    }
  } else {
    const fragments = sentence.fragments
      .map((fragment) => {
        const response = fragment.selectResponse(responses);
        if (response && fragment.shouldIncludeFragment(response)) {
          return fragment.toFragment(response.option.text.toLowerCase(), metadata);
        } else {
          return undefined;
        }
      })
      .filter((fragment) => fragment !== undefined);

    if (fragments.length === 0) {
      // TODO: log if no response is found
      return undefined;
    } else {
      return sentence.composeFragments(fragments, metadata);
    }
  }
}

function extractMetaData(assignment: Assignment, currentDate: Date): AssignmentMetaData {
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
    dateOfLetterGeneration: currentDate,
  };
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
