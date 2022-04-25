import { SurveyResponseDto } from 'src/assignment/dto/survey-response.dto';
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
            `Overall, ${youth.firstName} was ${aOrAn(qualifier)} employee.`,
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
    {
      sentences: [
        {
          toSentence: (qualifier, { youth }) =>
            `${youth.firstName} was ${qualifier} on time to work.`,
          selectResponse: (responses) => findByRegex(responses, /on time to work/),
          shouldIncludeSentence: ifOneOfTheseWords(['Almost Always', 'Always']),
        },
        {
          toSentence: (qualifier, { youth }) =>
            `${youth.firstName} ${qualifier} completed work related tasks in a timely manner.`,
          selectResponse: (responses) => findByRegex(responses, /timely manner/),
          shouldIncludeSentence: ifOneOfTheseWords(['Almost Always', 'Always']),
        },
      ],
    },
    {
      sentences: [
        {
          toSentence: (qualifier, { youth }) =>
            `${youth.firstName} was ${aOrAn(qualifier)} communicator.`,
          selectResponse: (responses) => findByRegex(responses, /communicating/),
          shouldIncludeSentence: ifOneOfTheseWords([
            'Effective',
            'Very Effective',
            'Incredibly Effective',
          ]),
        },
        {
          toSentence: (qualifier, { youth }) =>
            `${youth.firstName} was ${qualifier} at following instructions.`,
          selectResponse: (responses) => findByRegex(responses, /following instructions/),
          shouldIncludeSentence: ifOneOfTheseWords(['Good', 'Excellent']),
        },
      ],
    },
    {
      sentences: [
        {
          composeFragments: (fragments, { youth }) =>
            `In addition to ${youth.firstName}'s other strengths, ${
              youth.firstName
            } ${joinEndingWithAnd(fragments)}.`,
          fragments: [
            {
              toFragment: () => 'takes initiative',
              selectResponse: (responses) => findByRegex(responses, /take initiative/),
              shouldIncludeFragment: ifOneOfTheseWords(['Yes']),
            },
            {
              toFragment: () => 'is trustworthy',
              selectResponse: (responses) => findByRegex(responses, /trustworthy/),
              shouldIncludeFragment: ifOneOfTheseWords(['Yes']),
            },
            {
              toFragment: () => 'is respectful',
              selectResponse: (responses) => findByRegex(responses, /respectful/),
              shouldIncludeFragment: ifOneOfTheseWords(['Yes']),
            },
            {
              toFragment: () => 'works well in teams',
              selectResponse: (responses) => findByRegex(responses, /work well in teams/),
              shouldIncludeFragment: ifOneOfTheseWords(['Yes']),
            },
            {
              toFragment: () => 'is good at responding to constructive criticism',
              selectResponse: (responses) => findByRegex(responses, /constructive criticism/),
              shouldIncludeFragment: ifOneOfTheseWords(['Yes']),
            },
            {
              toFragment: () => 'is responsible',
              selectResponse: (responses) => findByRegex(responses, /responsible/),
              shouldIncludeFragment: ifOneOfTheseWords(['Yes']),
            },
          ],
        },
      ],
    },
    {
      sentences: [
        {
          toSentence: (_, { youth }) =>
            `Given the resources, I would hire ${youth.firstName} as a regular employee.`,
          selectResponse: (responses) => findByRegex(responses, /would you hire/),
          shouldIncludeSentence: ifOneOfTheseWords(['Yes']),
        },
        {
          toSentence: (_, { reviewer }) =>
            `I invite you to contact me if you would like more information. I can be reached at ${reviewer.email}.`,
          selectResponse: (responses) => findByRegex(responses, /act as a reference/),
          shouldIncludeSentence: ifOneOfTheseWords(['Yes']),
        },
      ],
    },
  ],
  closing: 'Sincerely',
};

/**
 * This logic isn't quite right. "An honorable", "a union", e.g. It's probably not a big deal
 * for now but just something to be aware of
 */
function aOrAn(word: string, capitalize = false): string {
  const AN = capitalize ? 'An' : 'an';
  const A = capitalize ? 'A' : 'a';
  const VOWELS = ['a', 'e', 'i', 'o', 'u'];
  return (VOWELS.includes(word[0].toLowerCase()) ? AN : A) + ' ' + word;
}

/**
 * Joins a list of strings by commas, and adds an 'and' to the end if there are more than one item.
 * Omits the oxford comma.
 * @example joinEndingWithAnd(['a', 'b', 'c']) => 'a, b and c'
 */
function joinEndingWithAnd(list: string[]): string {
  if (list.length === 1) {
    return list[0];
  }
  return list.slice(0, -1).join(', ') + ' and ' + list.slice(-1)[0];
}

/**
 * This is a hack, we should encode some enum into the question entity so we can clearly identify them.
 */
function findByRegex(responses: SurveyResponseDto[], regex: RegExp): SurveyResponseDto | undefined {
  return responses.find((response) => regex.test(response.question));
}

/**
 * Produces a predicate that returns true if the selection option text matches one of the given words.
 * Not case sensitive.
 */
function ifOneOfTheseWords(validOptions: string[]): (Response) => boolean {
  return (response: SurveyResponseDto) =>
    validOptions.map((str) => str.toLowerCase()).includes(response.selectedOption.toLowerCase());
}

export default DEFAULT_LETTER_GENERATION_RULES;
