export interface Question {
    correctAnswer: number; //ou null, dependendo do uso
    title: string;
    level?: number;
    answers: QuestionAnswer[];
}

export interface QuestionAnswer {
    description: string;
    isRight: boolean;
}