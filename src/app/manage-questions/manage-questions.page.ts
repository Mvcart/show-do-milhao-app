import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { Question } from '../models/question';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.page.html',
  styleUrls: ['./manage-questions.page.scss'],
})
export class ManageQuestionsPage implements OnInit {
  savedQuestions: Question[] = [];
  newQuestion: Question = {
    title: '',
    correctAnswer: 0,
    answers: [
      { description: '', isRight: false },
      { description: '', isRight: false },
      { description: '', isRight: false },
      { description: '', isRight: false },
    ],
    level: 1,
  };
  isEditing: boolean = false;
  editIndex: number | null = null;
  selectedTab: string = 'add';

  constructor(
    private questionService: QuestionService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.savedQuestions = this.questionService.getAllQuestions();
  }

  adjustCorrectAnswerIndex(question: Question): Question {
    const adjustedQuestion = { ...question };
    return adjustedQuestion;
  }

  async saveQuestion() {
    if (this.isQuestionValid()) {
      const adjustedQuestion = this.adjustCorrectAnswerIndex(this.newQuestion);
      if (this.isEditing && this.editIndex !== null) {
        this.questionService.updateQuestion(this.editIndex, adjustedQuestion);
        await this.presentToast('Pergunta atualizada com sucesso!');
      } else {
        this.questionService.addQuestion(adjustedQuestion);
        await this.presentToast('Pergunta adicionada com sucesso!');
      }
      this.resetForm();
      this.loadQuestions();
    } else {
      await this.presentToast(
        'Por favor, preencha todos os campos da pergunta.',
        'danger'
      );
    }
  }

  isQuestionValid(): boolean {
    return (
      this.newQuestion.title.trim() !== '' &&
      this.newQuestion.answers.every(
        (answer) => answer.description.trim() !== ''
      ) &&
      this.newQuestion.correctAnswer >= 1 &&
      this.newQuestion.correctAnswer <= this.newQuestion.answers.length
    );
  }

  async deleteQuestion(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir esta pergunta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.questionService.deleteQuestion(index);
            this.loadQuestions();
            this.presentToast('Pergunta excluída com sucesso!');
          },
        },
      ],
    });
    await alert.present();
  }

  editQuestion(index: number) {
    const questionToEdit = this.questionService.getQuestionByIndex(index);
    if (questionToEdit) {
      this.newQuestion = {
        ...questionToEdit,
        correctAnswer: questionToEdit.correctAnswer,
      };
      this.isEditing = true;
      this.editIndex = index;
      this.selectedTab = 'add';
    }
  }

  resetForm() {
    this.newQuestion = {
      title: '',
      correctAnswer: 0,
      answers: [
        { description: '', isRight: false },
        { description: '', isRight: false },
        { description: '', isRight: false },
        { description: '', isRight: false },
      ],
      level: 1,
    };
    this.isEditing = false;
    this.editIndex = null;
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }

  irParaMenu() {
    this.router.navigate(['/menu']);
  }

  async clearAllQuestions() {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir todas as perguntas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir todas',
          handler: () => {
            this.questionService.clearAllQuestions();
            this.loadQuestions();
            this.presentToast(
              'Todas as perguntas foram excluídas com sucesso!'
            );
          },
        },
      ],
    });
    await alert.present();
  }
}
