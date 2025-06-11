import { Letter } from './generateLetter';

const createFrequencyOptions = () => [
  {
    text: 'Never',
  },
  {
    text: 'Sometimes',
  },
  {
    text: 'Usually',
  },
  {
    text: 'Almost Always',
  },
  {
    text: 'Always',
  },
];

const createYesNoOptions = () => [
  {
    text: 'Yes',
  },
  {
    text: 'No',
  },
];

export const DEFAULT_SURVEY_QUESTIONS = [
  {
    text: 'Overall, how would you rate {subject} as an employee?',
    options: [
      {
        text: 'Very poor',
      },
      {
        text: 'Poor',
      },
      {
        text: 'Neutral',
      },
      {
        text: 'Good',
      },
      {
        text: 'Very good',
      },
      {
        text: 'Excellent',
      },
      {
        text: 'Exceptional',
      },
    ],
  },
  {
    text: 'How often did {subject} arrive on time for work?',
    options: createFrequencyOptions(),
  },
  {
    text: 'How often did {subject} complete work-related tasks in a timely manner?',
    options: createFrequencyOptions(),
  },
  {
    text: 'How was {subject} at communicating?',
    options: [
      {
        text: 'Not effective',
      },
      {
        text: 'Somewhat effective',
      },
      {
        text: 'Effective',
      },
      {
        text: 'Very effective',
      },
      {
        text: 'Incredibly effective',
      },
    ],
  },
  {
    text: 'How was {subject} at following instructions?',
    options: [
      {
        text: 'Poor',
      },
      {
        text: 'Neutral',
      },
      {
        text: 'Good',
      },
      {
        text: 'Very good',
      },
      {
        text: 'Excellent',
      },
    ],
  },
  {
    text: 'Did {subject} take initiative?',
    options: createYesNoOptions(),
  },
  {
    text: 'Was {subject} trustworthy?',
    options: createYesNoOptions(),
  },
  {
    text: 'Was {subject} respectful?',
    options: createYesNoOptions(),
  },
  {
    text: 'Did {subject} work well in teams?',
    options: createYesNoOptions(),
  },
  {
    text: 'Was {subject} good at responding to constructive criticism?',
    options: createYesNoOptions(),
  },
  {
    text: 'Was {subject} responsible?',
    options: createYesNoOptions(),
  },
  {
    text: 'Given enough resources, would you hire {subject} as a regular employee?',
    options: createYesNoOptions(),
  },
  {
    text: "Would you be willing to act as a reference for {subject}? We will include your email address as contact information if you respond 'Yes'.",
    options: createYesNoOptions(),
  },
];

export const exampleResponses = [
  {
    question: 'Overall, how would you rate {subject} as an employee?',
    selectedOption: 'Exceptional',
  },
  {
    question: 'How often did {subject} arrive on time for work?',
    selectedOption: 'Always',
  },
  {
    question: 'How often did {subject} complete work-related tasks in a timely manner?',
    selectedOption: 'Always',
  },
  {
    question: 'How was {subject} at communicating?',
    selectedOption: 'Incredibly effective',
  },
  { question: 'How was {subject} at following instructions?', selectedOption: 'Excellent' },
  { question: 'Did {subject} take initiative?', selectedOption: 'Yes' },
  { question: 'Was {subject} trustworthy?', selectedOption: 'Yes' },
  { question: 'Was {subject} respectful?', selectedOption: 'Yes' },
  { question: 'Did {subject} work well in teams?', selectedOption: 'Yes' },
  {
    question: 'Was {subject} good at responding to constructive criticism?',
    selectedOption: 'Yes',
  },
  { question: 'Was {subject} responsible?', selectedOption: 'Yes' },
  {
    question: 'Given enough resources, would you hire {subject} as a regular employee?',
    selectedOption: 'Yes',
  },
  {
    question:
      "Would you be willing to act as a reference for Ada? Your email address will be provided if you respond 'Yes'.",
    selectedOption: 'Yes',
  },
];

export const exampleLetter: Letter = {
  shouldBeSent: true,
  date: new Date(2022, 1, 1),
  greeting: 'To Whom It May Concern',
  paragraphs: [
    'Joe Shmoe worked for me at the Wharton School during this past Summer. Overall, Joe was an exceptional employee.',
    'Joe always completed work related tasks in a timely manner.',
    'Joe was an incredibly effective communicator. Joe was excellent at following instructions.',
    "In addition to Joe's other strengths, Joe takes initiative, is trustworthy, is respectful, works well in teams, is good at responding to constructive criticism and is responsible.",
    'Given the resources, I would hire Joe as a regular employee. I invite you to contact me if you would like more information. I can be reached at c4cneu.jpal+ben.lerner@gmail.com.',
  ],
  closing: 'Sincerely',
  signature: { fullName: 'Ben Lerner', organization: 'The Wharton School' },
};
