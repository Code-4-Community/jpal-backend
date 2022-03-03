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
