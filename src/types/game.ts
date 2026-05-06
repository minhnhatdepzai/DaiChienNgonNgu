export type QuestionType = 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'ORDER_WORDS';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'MULTIPLE_CHOICE';
  options: string[];
  correctAnswer: string;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'FILL_BLANK';
  correctAnswer: string;
}

export interface OrderWordsQuestion extends BaseQuestion {
  type: 'ORDER_WORDS';
  words: string[]; // Shuffled words to present
  correctOrder: string[]; // Correct ordered words
}

export type AnyQuestion = MCQQuestion | FillBlankQuestion | OrderWordsQuestion;

export interface QuizDeck {
  name: string;
  questions: AnyQuestion[];
}
