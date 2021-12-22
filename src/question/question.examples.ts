import { QuestionDto } from '../assignment/dto/question.dto';

export const NEVER = 'Never' as const;
export const RARELY = 'Rarely' as const;
export const SOMEWHAT = 'Somewhat' as const;
export const OFTEN = 'Often' as const;
export const ALWAYS = 'Always' as const;

export const FIVE_SENTIMENT_OPTIONS = [NEVER, RARELY, SOMEWHAT, OFTEN, ALWAYS];

export const exampleOptions = [
  {
    id: 1,
    text: 'Never',
    question: undefined,
  },
  {
    id: 2,
    text: 'Rarely',
    question: undefined,
  },
  {
    id: 3,
    text: 'Somewhat',
    question: undefined,
  },
  {
    id: 4,
    text: 'Often',
    question: undefined,
  },
  {
    id: 5,
    text: 'Always',
    question: undefined,
  },
];

const DEFAULT_QUESTIONS: QuestionDto[] = [
  {
    question: 'How often is this student responsible?',
    options: FIVE_SENTIMENT_OPTIONS,
  },
  {
    question: 'How often does this student demonstrate leadership?',
    options: FIVE_SENTIMENT_OPTIONS,
  },
  {
    question: 'How often does this student demonstrate initiative?',
    options: FIVE_SENTIMENT_OPTIONS,
  },
];

export default DEFAULT_QUESTIONS;
