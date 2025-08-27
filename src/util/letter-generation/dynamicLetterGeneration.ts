import { LetterGenerationRules } from './generateLetter';
import { SurveyResponseDto } from '../../assignment/dto/survey-response.dto';
import { AssignmentMetaData } from './generateLetter';

const DynamicLetterGenerationRules: LetterGenerationRules = {
  greeting: ({ metaData }: { metaData: AssignmentMetaData }) =>
    `${metaData.surveyTemplate.greeting}`,

  paragraphs: ({
    metaData,
    responses,
  }: {
    metaData: AssignmentMetaData;
    responses: SurveyResponseDto[];
  }) => {
    return metaData.surveyTemplate.paragraphs.map((paragraph) => {
      return {
        sentences: ({ metaData }: { metaData: AssignmentMetaData }) => {
          return paragraph.sentences.map((sentence) => {
            if (sentence.isPlainText) {
              return sentence.template
                .replace('{subject_first_name}', metaData.youth.firstName)
                .replace('{subject_last_name}', metaData.youth.lastName)
                .replace('{organization_name}', metaData.organization);
            } else if (sentence.isMultiQuestion) {
            } else {
              // single question sentence
              const relevantResponse = findByRegex(responses, new RegExp(sentence.template));

              if (relevantResponse) {
                const selectedOption = relevantResponse.selectedOption;
                if (ifOneOfTheseWords(sentence.includeIfSelectedOptions)(relevantResponse)) {
                  return sentence.template
                    .replace('{subject_first_name}', metaData.youth.firstName)
                    .replace('{subject_last_name}', metaData.youth.lastName)
                    .replace('{organization_name}', metaData.organization)
                    .replace('{qualifier}', aOrAn(selectedOption))
                    .replace('{selected_option}', selectedOption);
                }
              }
              return ''; // Skip if conditions not met
            }
          });
        },
      };
    });
  },

  closing: ({ metaData }: { metaData: AssignmentMetaData }) => `${metaData.surveyTemplate.closing}`,
};

function aOrAn(word: string, capitalize = false): string {
  const AN = capitalize ? 'An' : 'an';
  const A = capitalize ? 'A' : 'a';
  const VOWELS = ['a', 'e', 'i', 'o', 'u'];
  return (VOWELS.includes(word[0].toLowerCase()) ? AN : A) + ' ' + word;
}

/**
 * This is a hack, we should encode some enum into the question entity so we can clearly identify them.
 *
 * Max: this is terrible i hate this let's replace this asap!!
 */
function findByRegex(responses: SurveyResponseDto[], regex: RegExp): SurveyResponseDto | undefined {
  return responses.find((response) => regex.test(response.question));
}

/**
 * Produces a predicate that returns true if the selection option text matches one of the given words.
 * Not case sensitive.
 */
function ifOneOfTheseWords(validOptions: string[]): (response: SurveyResponseDto) => boolean {
  return (response: SurveyResponseDto) =>
    validOptions.map((str) => str.toLowerCase()).includes(response.selectedOption.toLowerCase());
}

export default DynamicLetterGenerationRules;
