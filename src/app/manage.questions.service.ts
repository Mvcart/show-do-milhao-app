import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Question } from './models/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private firestore: Firestore = inject(Firestore);

  // Adicionar uma pergunta
  addQuestion(question: Question) {
    const questionsCollection = collection(this.firestore, 'questions');
    return addDoc(questionsCollection, question);
  }

  // Obter todas as perguntas
  getQuestions() {
    const questionsCollection = collection(this.firestore, 'questions');
    return getDocs(questionsCollection);
  }

  // Atualizar uma pergunta
  updateQuestion(id: string, question: Partial<Question>) {
    const questionDoc = doc(this.firestore, `questions/${id}`);
    return updateDoc(questionDoc, question);
  }

  // Deletar uma pergunta
  deleteQuestion(id: string) {
    const questionDoc = doc(this.firestore, `questions/${id}`);
    return deleteDoc(questionDoc);
  }
}