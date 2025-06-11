import { SurveyResponseDto } from 'src/assignment/dto/survey-response.dto';
import { Assignment } from '../../assignment/types/assignment.entity';

export type Letter = {
  shouldBeSent: boolean;
  date: Date;
  headerImageURL: string | null;
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
  headerImageURL: string | null;
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
  selectResponse: (responses: SurveyResponseDto[]) => SurveyResponseDto | undefined;
  shouldIncludeSentence: (response: SurveyResponseDto) => boolean;
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
  selectResponse: (responses: SurveyResponseDto[]) => SurveyResponseDto | undefined;
  shouldIncludeFragment: (response: SurveyResponseDto) => boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isMultiResponseSentence(expr): expr is MultiResponseSentence {
  return (expr as MultiResponseSentence).composeFragments !== undefined;
}

export default function generateLetter(
  responses: SurveyResponseDto[],
  metadata: AssignmentMetaData,
  rules: LetterGenerationRules,
): Letter {
  const generatedParagraphs = rules.paragraphs
    .map((paragraphRules) => generateParagraph(paragraphRules, responses, metadata))
    .filter((paragraph) => paragraph !== undefined);
  return {
    shouldBeSent: generatedParagraphs.length >= 3,
    date: metadata.dateOfLetterGeneration,
    headerImageURL: metadata.headerImageURL,
    greeting: rules.greeting,
    paragraphs: generatedParagraphs,
    closing: rules.closing,
    signature: {
      fullName: getFullName(metadata.reviewer.firstName, metadata.reviewer.lastName),
      organization: metadata.organization,
    },
  };
}

function generateParagraph(
  paragraphRules: Paragraph,
  responses: SurveyResponseDto[],
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
  responses: SurveyResponseDto[],
  metadata: AssignmentMetaData,
): string | undefined {
  if (typeof sentence === 'function') {
    return sentence(metadata);
  } else if (isSingleResponseSentence(sentence)) {
    const response = sentence.selectResponse(responses);
    // TODO: log if no response is found
    if (response === undefined) {
      return undefined;
    } else if (response && sentence.shouldIncludeSentence(response)) {
      return sentence.toSentence(response.selectedOption.toLowerCase(), metadata);
    }
  } else {
    const fragments = sentence.fragments
      .map((fragment) => {
        const response = fragment.selectResponse(responses);
        if (response && fragment.shouldIncludeFragment(response)) {
          return fragment.toFragment(response.selectedOption.toLowerCase(), metadata);
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
    headerImageURL: assignment.survey.imageURL,
  };
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
