## Extra documentation on the letter generation strategy

We designed the letter generation such that all you need to do is write out the structure of the letter in the form of a Javscript object. Here's a little guide on how you can get the letter you want!

A `LetterGenerationRules` is of the form:

```ts
{
  greeting: string;
  paragraphs: [
    {
      sentences: {
        (metadata) => `Some literal string with metadata like: ${metadata.reviewer.email} sprinkled in!`,
        // OR
        // A more precise translation that uses a response from the form (this is far more common)
        {
            // a function that takes the option (automatically converted to lowercase),
            // and returns the sentence that it translates to
            toSentence: (selectedOption: string, metadata: AssignmentMetaData) => string

            // a function that selects the appropriate response in the form that corresponds with this sentence
            // see `findByRegex`
            selectResponse: (responses: Response[]) => Response | undefined;

            // a predicate that determines if we should include this sentence
            // Ex. we only include this sentence if the response option text was "Always" or "Almost Always"
            // see helper functions: `isOneOfTheseWords` and `ifListContainsAtLeastOneOf`
            shouldIncludeSentence: (response: Response) => boolean;
        }
      }
    }
    ...
  ];
  closing: string;
};
```

Some of the sentence generation rules get a little ugly, but that's the price we pay for flexibility!

To help alleivate this somewhat, we have some helper functions:

`findByRegex` is useful for `selectResponse`, and just finds the response which as a question text matching the regex provided.

`ifOneOfTheseWords` is useful for `shouldIncludeSentence`, and produces a predicate that returns true if the response option text is one of the words provided.

`ifListContainsOneOf` is also useful for `shouldIncludeSentence` and deals with comma delimited list type responses in the form "option1,option2,option". This will automatically split the list and determine if any of the options are contained in the list provided.

Finally we have helpers for building sentences.

`aOrAn` produces a phrase with "a" or "an" before the word depending on if the first letter of the word is a vowel.

`joinEndingWithAnd` joins a list into a comma-space separated list ending with and (omitting the oxford comma).
`Ex. ["a", "b", "c"] => "a, b and c"`

### Edge Cases

- If a response cannot be found for any reason, the sentence is elided. We may decide that want to log this, or throw an error instead. Ignoring the error is chosen for simplicity.

- If none of a paragaph's sentences are valid for inclusion, then the entire paragraph is omitted.

- Response option text is guaranteed to be lower cases in `toSentence`, but not anywhere else. Some thought must be put into if the option text is capitalized. Use .toLowerCase() when unsure.
