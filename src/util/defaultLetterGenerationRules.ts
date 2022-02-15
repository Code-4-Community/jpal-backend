import { Response } from '../../src/response/types/response.entity';
import { LetterGenerationRules } from './generateLetter';

const DEFAULT_LETTER_GENERATION_RULES: LetterGenerationRules = {
  greeting: 'To Whom It May Concern',
  paragraphs: [
    {
      sentences: [
        ({ youth }) =>
          `${youth.fullName} worked for me at the Wharton School during this past Summer.`,
        {
          toSentence: (qualifier, { youth }) =>
            `Overall, ${youth.fullName} was ${aOrAn(qualifier)} employee.`,
          selectResponse: (responses) => findByRegex(responses, /^Overall,/),
          shouldIncludeSentence: ifOneOfTheseWords([
            'Good',
            'Very Good',
            'Excellent',
            'Exceptional',
          ]),
        },
      ],
    },
  ],
  closing: 'Sincerely',
};

function aOrAn(word: string, capitalize = false): string {
  const AN = capitalize ? 'An' : 'an';
  const A = capitalize ? 'A' : 'a';
  const VOWELS = ['a', 'e', 'i', 'o', 'u'];
  return (VOWELS.includes(word[0].toLowerCase()) ? AN : A) + ' ' + word;
}

/**
 * This is a hack, we should encode some enum into the question entity so we can clearly identify them.
 */
function findByRegex(responses: Response[], regex: RegExp): Response | undefined {
  return responses.find((response) => regex.test(response.question.text));
}

/**
 * Produces a predicate that returns true if the selection option text matches one of the given words.
 * Not case sensitive.
 */
function ifOneOfTheseWords(validOptions: string[]): (Response) => boolean {
  return (response: Response) =>
    validOptions.map((str) => str.toLowerCase()).includes(response.option.text.toLowerCase());
}

export default DEFAULT_LETTER_GENERATION_RULES;
