import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../question.service';
import { Question } from '../models/question';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.page.html',
  styleUrls: ['./manage-questions.page.scss'],
})
export class ManageQuestionsPage {
  question: Question = {
    title: '',
    correctAnswer: 0, // Inicializado como 0 para evitar conflito de tipo
    answers: [
      { description: '', isRight: false },
      { description: '', isRight: false },
      { description: '', isRight: false },
      { description: '', isRight: false },
    ],
  };

  isEditing: boolean = false; // Controle do estado de edição
  editIndex: number | null = null; // Índice da pergunta em edição

  savedQuestions: Question[] = [];

  constructor(
    private questionService: QuestionService,
    private router: Router
  ) {
    this.loadQuestions();
  }

  irParaMenu(): void {
    this.router.navigate(['/menu']);
  }

  loadQuestions(): void {
    this.savedQuestions = this.questionService.getAllQuestions();
  }



  deleteQuestion(index: number): void {
    this.questionService.deleteQuestion(index);
    this.loadQuestions(); // Atualiza a lista após exclusão
  }

  // Método para iniciar a edição de uma pergunta
  editQuestion(index: number): void {
    const questionToEdit = this.savedQuestions[index];
    this.question = { ...questionToEdit }; // Copia os dados da pergunta para edição
    this.isEditing = true;
    this.editIndex = index;
  }

  // Método para salvar ou atualizar a pergunta
  saveQuestion(): void {
    if (
      this.question.correctAnswer === null || 
      this.question.correctAnswer < 0 || 
      this.question.correctAnswer >= this.question.answers.length
    ) {
      alert('Índice de resposta correta inválido.');
      return;
    }

    if (this.isEditing && this.editIndex !== null) {
      // Atualiza a pergunta em edição
      this.savedQuestions[this.editIndex] = { ...this.question };
      alert('Pergunta atualizada com sucesso!');
      this.isEditing = false; // Reseta o estado de edição
      this.editIndex = null;
    } else {
      // Adiciona uma nova pergunta
      this.savedQuestions.push({ ...this.question });
      alert('Pergunta salva com sucesso!');
    }

    this.resetQuestionForm();
  }

  private resetQuestionForm(): void {
    this.question = {
      title: '',
      correctAnswer: 0,
      answers: [
        { description: '',isRight: false},
        { description: '',isRight: false},
        { description: '', isRight: false},
        { description: '', isRight: false},
      ],
    };
    this.isEditing = false;
    this.editIndex = null;
  
}

  debugDecryptQuestions(): void {
    const encryptedData = localStorage.getItem('questions');
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, 'jushow'); // Substitua pela sua chave
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        const questions = JSON.parse(decryptedData);
        console.log('Perguntas descriptografadas:', questions);
      } catch (e) {
        console.error('Erro ao descriptografar perguntas:', e);
      }
    } else {
      console.log('Nenhuma pergunta encontrada no Local Storage.');
    }
  }

  exportQuestions(): void {
    this.questionService.exportQuestions();
  }
}
