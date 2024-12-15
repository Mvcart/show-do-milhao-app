import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { PrizeInfo } from 'src/app/models/prize-info';
import { Question, QuestionAnswer } from 'src/app/models/question';
import { QuestionService } from '../question.service';
import { environment } from 'src/environments/environment';
import { EndingPage } from '../ending/ending.page';
import { AudioService } from '../audio.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit, OnDestroy {
  curQuestion: Question | null = null;
  prizeInfo: PrizeInfo | null = null;
  timeLeft: number = 30;
  private intervalID: any = null;
  isMusicPlaying: boolean = true;
  answerClass: string = '';
  totalPrize: number = 0;
  numQuestionsPlayed: number = 0;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private questionService: QuestionService,
    private audioService: AudioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.totalPrize = +params['totalPrize'] || 0;
      const numeroQuestoes = +params['numeroQuestoes'] || 0;

      if (this.totalPrize && numeroQuestoes) {
        // Iniciar a música antes de qualquer outra coisa
        if (!this.audioService.isPlaying()) {
          this.audioService.playMusic();
        }

        // Inicia o jogo
        this.restartGame(numeroQuestoes);
      } else {
        console.error('Parâmetros incorretos');
      }
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.audioService.pauseMusic();
  }

  toggleMusic(): void {
    this.isMusicPlaying = !this.isMusicPlaying;
    this.isMusicPlaying
      ? this.audioService.playMusic()
      : this.audioService.pauseMusic();
  }

  speakText(text: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';

      if (this.isMusicPlaying && this.audioService.isPlaying()) {
        this.audioService.setVolume(0.2);
      }

      utterance.onend = () => {
        if (this.isMusicPlaying) {
          this.audioService.setVolume(1);
          this.audioService.playMusic();
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis API não disponível neste navegador.');
    }
  }

  loadQuestion(): void {
    this.clearTimer(); // Garante que o temporizador anterior seja limpo.
  
    try {
      this.curQuestion = this.questionService.nextQuestion(); // Obtém a próxima pergunta.
      this.prizeInfo = this.questionService.getPrizeInfo(); // Atualiza os prêmios.
      this.timeLeft = environment.timePerQuestion; // Reinicia o tempo.
      
      if (this.curQuestion) {
        console.log('Carregando pergunta:', this.curQuestion);
        this.speakText(this.curQuestion.title); // Fala o título da pergunta.
        this.startTimer(); // Inicia o temporizador.
      }
    } catch (error) {
      console.error('Erro ao carregar a pergunta:', error);
      this.finish(
        'Fim de jogo',
        'Todas as perguntas foram respondidas!',
        'gameOver'
      );
    }
  }
  
  restartGame(numeroQuestoes: number): void {
    this.clearTimer();
    this.questionService.setPrizeValues(this.totalPrize, numeroQuestoes);
    this.questionService.resetGame(numeroQuestoes);
    this.numQuestionsPlayed = 0;
    this.loadQuestion();
    this.startTimer();
  }

  async finish(title: string, message: string, endingType: string): Promise<void> {
    this.clearTimer();

    let modal: HTMLIonModalElement | null = null;
    let prizeToSend: number = 0;

    if (endingType === 'wrongAnswer') {
      prizeToSend = this.prizeInfo?.wrongAnswer || 0;
    } else if (endingType === 'quit') {
      prizeToSend = this.prizeInfo?.quit || 0;
    } else {
      prizeToSend = this.prizeInfo?.correctAnswer || 0;
    }

    try {
      modal = await this.modalCtrl.create({
        component: EndingPage,
        componentProps: {
          title,
          message,
          endingType,
          totalPrize: prizeToSend,
          numeroQuestoes: this.numQuestionsPlayed,
        },
        backdropDismiss: false,
      });

      if (modal) {
        await modal.present();
      }
    } catch (error) {
      console.error('Erro ao criar ou apresentar o modal:', error);
    }
  }

  async cancelar() {
    try {
      const modal = await this.modalCtrl.getTop();
      if (modal) {
        await modal.dismiss();
      }
    } catch (error) {
      console.error('Erro ao tentar fechar o modal:', error);
    }
  }

  private startTimer(): void {
    this.clearTimer();
    this.intervalID = setInterval(() => {
      if (--this.timeLeft === 0) {
        this.clearTimer();
        this.finish('Fim de jogo', 'Seu tempo acabou!', 'timeout');
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }

  giveUp(): void {
    this.finish('Fim de jogo', 'Você parou!', 'quit');
  }

  doAnswer(answer: QuestionAnswer): void {
    this.clearTimer(); // Para o temporizador quando uma resposta é selecionada
    this.speakText(answer.description);

    if (this.curQuestion && this.curQuestion.answers[this.curQuestion.correctAnswer] === answer) {
      this.speakText('Certa resposta');
      this.blinkScreen('correct-answer-blink');
      this.numQuestionsPlayed++;
      setTimeout(() => this.loadQuestion(), 2000); // Carrega a próxima pergunta após 2 segundos
    } else {
      this.speakText('Você errou');
      this.blinkScreen('wrong-answer-blink');
      this.numQuestionsPlayed++;
      setTimeout(() => this.finish('Fim de jogo', 'Você errou!', 'wrongAnswer'), 2000);
    }
  }

  blinkScreen(className: string): void {
    this.answerClass = className;
    setTimeout(() => (this.answerClass = ''), 1500);
  }
}