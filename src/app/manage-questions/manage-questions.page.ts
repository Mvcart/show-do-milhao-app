import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../manage.questions.service';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.page.html',
  styleUrls: ['./manage-questions.page.scss'],
})
export class ManageQuestionsPage {
  question = {
    title: '',
    correctAnswer: null,
    answers: [
      { description: '' },
      { description: '' },
      { description: '' },
      { description: '' },
    ],
  };

  constructor(
    private router: Router,
    private QuestionService: QuestionService
  ) {}

  saveQuestion(): void {
    this.QuestionService.saveQuestion(this.question);
    alert('Pergunta salva com sucesso!');
    this.resetQuestionForm();
  }

  exportQuestions(): void {
    this.QuestionService.exportQuestions();
  }

  irParaMenu(): void {
    this.router.navigate(['/menu']);
  }

  private resetQuestionForm(): void {
    this.question = {
      title: '',
      correctAnswer: null,
      answers: [
        { description: '' },
        { description: '' },
        { description: '' },
        { description: '' },
      ],
    };
  }
}
