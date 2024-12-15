import { Injectable } from '@angular/core';
import { PrizeInfo } from './models/prize-info';
import { Question } from './models/question';
import * as CryptoJS from 'crypto-js';

const STORAGE_KEY = 'questions';
const SECRET_KEY = 'jushow';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private questionCount: number = 0;
  private usedQuestions: Question[] = [];
  private questions: Question[] = [];
  private questionPrizes: number[] = [];
  private addedOriginalQuestions: Set<string> = new Set();

  private originalQuestions: Question[] = [
    {
      title: 'Um número múltiplo de cinco é?',
      correctAnswer: 1,
      answers: [
        { description: 'Um número que é divisível por 3', isRight: false },
        { description: 'Um número que é divisível por 5', isRight: true },
        {
          description: 'Um número que multiplicado por 5 é par',
          isRight: false,
        },
        { description: 'Um número que somado com 5 é impar', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'Qual o nome do principal personagem do anime Dragon Ball?',
      correctAnswer: 0,
      answers: [
        { description: 'Goku', isRight: true },
        { description: 'Freeza', isRight: false },
        { description: 'Mabel', isRight: false },
        { description: 'Leon Kennedy', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'De quanto em quanto tempo acontece uma Copa do Mundo?',
      correctAnswer: 3,
      answers: [
        { description: 'De dois em dois anos', isRight: false },
        { description: 'De oito em oitro anos', isRight: false },
        { description: 'Ocorre todos os anos', isRight: false },
        { description: 'De quatro em quatro anos', isRight: true },
      ],
      level: 1,
    },
    {
      title: 'Quantos meses do ano possuem 28 dias?',
      correctAnswer: 3,
      answers: [
        { description: 'Apenas um mês', isRight: false },
        { description: 'Seis meses', isRight: false },
        { description: 'Oito meses', isRight: false },
        { description: 'Doze meses', isRight: true },
      ],
      level: 1,
    },
    {
      title: 'Qual a cor que simboliza a esperança?',
      correctAnswer: 1,
      answers: [
        { description: 'Branco', isRight: false },
        { description: 'Verde', isRight: true },
        { description: 'Azul', isRight: false },
        { description: 'Vermelho', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'Quais os dois primeiros nomes da apresentadora Xuxa?',
      correctAnswer: 2,
      answers: [
        { description: 'Maria de Lourdes', isRight: false },
        { description: 'Maria do Carmo', isRight: false },
        { description: 'Maria da Graça', isRight: true },
        { description: 'Maria Isabel', isRight: false },
      ],
      level: 1,
    },
    {
      title:
        'Qual o presidente brasileiro responsável pela constução de brasília?',
      correctAnswer: 1,
      answers: [
        { description: 'Jãnio Quadros', isRight: false },
        { description: 'Juscelino Kubitschek', isRight: true },
        { description: 'Getúlio Vargas', isRight: false },
        { description: 'Eurico Gaspar Dutra', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'Como chamamos o sono do urso durante o inverno?',
      correctAnswer: 3,
      answers: [
        { description: 'Preguiça', isRight: false },
        { description: 'Demaio', isRight: false },
        { description: 'Cochilo', isRight: false },
        { description: 'Hibernação', isRight: true },
      ],
      level: 1,
    },
    {
      title: 'Segundo a lenda em que fase da lua aparece o lobisomem?',
      correctAnswer: 1,
      answers: [
        { description: 'Nova', isRight: false },
        { description: 'Cheia', isRight: true },
        { description: 'Minguagnte', isRight: false },
        { description: 'Crescente', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'Em que ano foi morto John Lennon?',
      correctAnswer: 0,
      answers: [
        { description: '1980', isRight: true },
        { description: '1985', isRight: false },
        { description: '1981', isRight: false },
        { description: '1978', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'Qual foi o último estado criado no Brasil?',
      correctAnswer: 0,
      answers: [
        { description: 'Tocantins', isRight: true },
        { description: 'Rondônia', isRight: false },
        { description: 'Acre', isRight: false },
        { description: 'Mato Grosso do Sul', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'Em qual dos clubes abaixo o jogador Yuri Alberto é ídolo?',
      correctAnswer: 1,
      answers: [
        { description: 'Santos', isRight: false },
        { description: 'Corinthians', isRight: true },
        { description: 'Bahia', isRight: false },
        { description: 'São Paulo', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'Em qual estado brasileiro ocorreu a guerra de canudos?',
      correctAnswer: 1,
      answers: [
        { description: 'Sergipe', isRight: false },
        { description: 'Bahia', isRight: true },
        { description: 'São Paulo', isRight: false },
        { description: 'Rio de Janeiro', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'Qual o nome que se dá a mistura de água com sal?',
      correctAnswer: 1,
      answers: [
        { description: 'Gangorra', isRight: false },
        { description: 'Salmoura', isRight: true },
        { description: 'Melado', isRight: false },
        { description: 'Salada', isRight: false },
      ],
      level: 1,
    },
    {
      title: 'De onde as abelhas extraem o mel?',
      correctAnswer: 1,
      answers: [
        { description: 'Rochas', isRight: false },
        { description: 'Flores', isRight: true },
        { description: 'Terra', isRight: false },
        { description: 'Água', isRight: false },
      ],
      level: 1,
    },
  ];

  constructor() {
    this.loadQuestionsFromStorage();
  }

  private loadQuestionsFromStorage(): void {
    const encryptedData = localStorage.getItem(STORAGE_KEY);
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        this.questions = JSON.parse(decryptedData);

        // Update the set of added original questions
        this.addedOriginalQuestions = new Set(
          this.questions
            .filter((q) =>
              this.originalQuestions.some((oq) => oq.title === q.title)
            )
            .map((q) => q.title)
        );
      } catch (error) {
        console.error('Erro ao carregar perguntas do Local Storage:', error);
        this.questions = [];
      }
    } else {
      this.questions = [];
    }

    // Add missing original questions
    this.addMissingOriginalQuestions();

    console.log('Perguntas carregadas:', this.questions);
  }

  clearAllQuestions(): void {
    this.questions = [];
    this.addedOriginalQuestions.clear();
    this.saveQuestionsToStorage();
    console.log('Todas as questões foram removidas.');
  }

  private addMissingOriginalQuestions(): void {
    this.originalQuestions.forEach((question) => {
      if (!this.addedOriginalQuestions.has(question.title)) {
        this.questions.push(question);
        this.addedOriginalQuestions.add(question.title);
      }
    });
  }

  private saveQuestionsToStorage(): void {
    try {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(this.questions),
        SECRET_KEY
      ).toString();
      localStorage.setItem(STORAGE_KEY, encryptedData);
    } catch (error) {
      console.error('Erro ao salvar perguntas:', error);
    }
  }

  addQuestion(question: Question): void {
    this.questions.push(question);
    if (this.originalQuestions.some((q) => q.title === question.title)) {
      this.addedOriginalQuestions.add(question.title);
    }
    this.saveQuestionsToStorage();
  }

  deleteQuestion(index: number): void {
    const deletedQuestion = this.questions[index];
    this.questions.splice(index, 1);
    if (this.originalQuestions.some((q) => q.title === deletedQuestion.title)) {
      this.addedOriginalQuestions.delete(deletedQuestion.title);
    }
    this.saveQuestionsToStorage();
  }

  getAllQuestions(): Question[] {
    return this.questions;
  }

  getCurrentQuestion(): Question | null {
    if (this.questionCount > 0 && this.questionCount <= this.questions.length) {
      return this.questions[this.questionCount - 1];
    }
    return null;
  }

  setPrizeValues(totalPrize: number, numberOfQuestions: number): void {
    this.questionPrizes = [];
    const prizeIncrement = totalPrize / numberOfQuestions;
    for (let i = 1; i <= numberOfQuestions; i++) {
      const prizeForThisQuestion = prizeIncrement * i;
      this.questionPrizes.push(prizeForThisQuestion);
    }
    console.log('Valores dos prêmios (linear):', this.questionPrizes);
  }

  getPrizeInfo(): PrizeInfo {
    if (
      this.questionCount <= 0 ||
      this.questionCount > this.questionPrizes.length
    ) {
      return { correctAnswer: 0, wrongAnswer: 0, quit: 0 };
    }
    const curQuestionPrize = this.questionPrizes[this.questionCount - 1] || 0;
    const prevQuestionPrize = this.questionPrizes[this.questionCount - 2] || 0;
    const prevPrevQuestionPrize =
      this.questionPrizes[this.questionCount - 3] || 0;

    return {
      correctAnswer: curQuestionPrize,
      wrongAnswer: this.questionCount <= 2 ? 0 : prevPrevQuestionPrize,
      quit: this.questionCount === 1 ? 0 : prevQuestionPrize,
    };
  }

  resetGame(numeroQuestoes: number): void {
    this.questionCount = 0;
    this.shuffleQuestions();
    this.questions = this.questions.slice(0, numeroQuestoes);
    console.log('Estado do jogo reiniciado:');
    console.log('Perguntas carregadas:', this.questions);
  }

  private shuffleQuestions(): void {
    this.questions.sort(() => 0.5 - Math.random());
    console.log('Perguntas embaralhadas:', this.questions);
  }

  nextQuestion(): Question {
    if (this.questionCount < this.questions.length) {
      const nextQuestion = this.questions[this.questionCount];
      this.questionCount++;
      return nextQuestion;
    }
    throw new Error('Não há mais perguntas.');
  }

  getTotalQuestions(): number {
    return this.questions.length;
  }

  exportQuestions(): void {
    if (!this.questions.length) {
      alert('Nenhuma pergunta disponível para exportar.');
      return;
    }

    const blob = new Blob([JSON.stringify(this.questions)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'questions.json';
    link.click();
  }

  importQuestions(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedQuestions = JSON.parse(reader.result as string);
        if (
          Array.isArray(importedQuestions) &&
          importedQuestions.length === 0
        ) {
          this.clearAllQuestions();
          alert('Todas as questões foram removidas.');
        } else if (Array.isArray(importedQuestions)) {
          this.questions = [...this.questions, ...importedQuestions];
          this.saveQuestionsToStorage();
          alert('Perguntas importadas com sucesso!');
        } else {
          throw new Error('Formato de arquivo inválido.');
        }
      } catch (e) {
        console.error('Erro ao importar perguntas:', e);
        alert('Erro ao importar perguntas. Verifique o formato do arquivo.');
      }
    };
    reader.readAsText(file);
  }

  updateQuestion(index: number, updatedQuestion: Question): void {
    if (index >= 0 && index < this.questions.length) {
      this.questions[index] = updatedQuestion;
      this.saveQuestionsToStorage();
    }
  }

  getQuestionByIndex(index: number): Question | undefined {
    return this.questions[index];
  }
}
