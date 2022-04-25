import DEFAULT_LETTER_GENERATION_RULES from './defaultLetterGenerationRules';
import { exampleResponses } from './examples';
import generateLetter from './generateLetter';

describe('Letter Generation', () => {
  describe('generateLetter', () => {
    it('should generate a reasonable letter from standard responses to a standard form', () => {
      const letter = generateLetter(
        exampleResponses,
        {
          youth: {
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
          },
          reviewer: {
            firstName: 'Jane',
            lastName: 'Doe',
            fullName: 'Jane Doe',
            email: 'c4cneu@gmail.com',
          },
          organization: 'Code 4 Community',
          dateOfLetterGeneration: new Date(2020, 1, 1),
        },
        DEFAULT_LETTER_GENERATION_RULES,
      );

      expect(letter.greeting).toEqual(DEFAULT_LETTER_GENERATION_RULES.greeting);
      expect(letter.closing).toEqual(DEFAULT_LETTER_GENERATION_RULES.closing);
      expect(letter.signature.fullName).toEqual('Jane Doe');
      expect(letter.signature.organization).toEqual('Code 4 Community');
      expect(letter.paragraphs.length).toEqual(DEFAULT_LETTER_GENERATION_RULES.paragraphs.length);
      expect(letter.date).toEqual(new Date(2020, 1, 1));
      expect(letter.shouldBeSent).toEqual(true);
    });
  });
});
