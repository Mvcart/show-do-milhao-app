import { Injectable } from '@angular/core';
import { SecureStorageService } from './secure-storage.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  QuestionService: any;
  getQuestions(): any[] {
    return SecureStorageService.getItem('questions') || [];
  }

  saveQuestion(question: any): void {
    const questions = this.getQuestions();
    questions.push(question);
    SecureStorageService.setItem('questions', questions);
  }

  question(arg0: string, question: any) {
    throw new Error('Method not implemented.');
  }
  resetQuestionForm() {
    throw new Error('Method not implemented.');
  }
  

  deleteQuestion(index: number): void {
    const questions = this.getQuestions();
    questions.splice(index, 1);
    SecureStorageService.setItem('questions', questions);
  }
  exportQuestions(): void {
    const questions = this.getQuestions();
    if (!questions.length) {
      alert('Nenhuma pergunta disponível para exportar.');
      return;
    }

    const blob = new Blob([JSON.stringify(questions)], { type: 'application/json' });
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
        const questions = JSON.parse(reader.result as string);
        SecureStorageService.setItem('questions', questions);
        alert('Perguntas importadas com sucesso!');
      } catch (e) {
        alert('Erro ao importar perguntas.');
      }
    };
    reader.readAsText(file);
  }
}
