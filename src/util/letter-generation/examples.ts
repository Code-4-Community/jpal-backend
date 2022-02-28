const FREQUENCY_OPTIONS = [
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

export const questions = [
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
    options: FREQUENCY_OPTIONS,
  },
  {
    text: 'How often did {subject} complete work-related tasks in a timely manner?',
    options: FREQUENCY_OPTIONS,
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
    text: 'Which of these describe {subject}? Please select all that apply.',
    options: [
      {
        text: 'takes initiative',
      },
      {
        text: 'is trustworthy',
      },
      {
        text: 'is respectful',
      },
      {
        text: 'works well in teams',
      },
      {
        text: 'is good at responding to constructive criticism',
      },
      {
        text: 'is responsible',
      },
    ],
  },
  {
    text: 'Given enough resources, would you hire {subject} as a regular employee?',
    options: [
      {
        text: 'Yes',
      },
      {
        text: 'No',
      },
    ],
  },
  {
    text: "Would you be willing to act as a reference for {subject}? We will include your email address as contact information if you respond 'Yes'.",
    options: [
      {
        text: 'Yes',
      },
      {
        text: 'No',
      },
    ],
  },
];
