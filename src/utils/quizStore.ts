import { AnyQuestion, QuizDeck } from '../types/game';

class QuizStore {
  private currentDeck: QuizDeck | null = null;
  private questionCount: number = 0;

  setDeck(deck: QuizDeck) {
    this.currentDeck = deck;
    this.questionCount = 0;
  }

  getDeck() {
    return this.currentDeck;
  }

  getRandomQuestion(): AnyQuestion | null {
    if (!this.currentDeck || this.currentDeck.questions.length === 0) return null;
    this.questionCount++;
    const isSpecial = this.questionCount % 5 === 0;
    
    // Pick a random question
    const qIndex = Math.floor(Math.random() * this.currentDeck.questions.length);
    const q = this.currentDeck.questions[qIndex];
    return q;
  }

  isSpecialRound(): boolean {
    return this.questionCount > 0 && this.questionCount % 5 === 0;
  }
}

export const quizStore = new QuizStore();
