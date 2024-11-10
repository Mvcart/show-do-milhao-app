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

  // Função centralizada para ler textos e pausar/retomar música
  speakText(text: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';

      if (this.isMusicPlaying && this.audioService.isPlaying()) {
        // Reduz o volume da música antes de falar
        this.audioService.setVolume(0.2); // Volume reduzido
      }

      utterance.onend = () => {
        if (this.isMusicPlaying) {
          // Restaura o volume da música após o término da fala
          this.audioService.setVolume(1); // Volume normal
          this.audioService.playMusic();
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis API não disponível neste navegador.');
    }
  }

  // Carrega uma pergunta
  loadQuestion(): void {
    this.curQuestion = this.questionService.nextQuestion();
    if (this.curQuestion) {
      this.prizeInfo = this.questionService.getPrizeInfo();
      this.timeLeft = environment.timePerQuestion;
      this.speakText(this.curQuestion.title);
    } else {
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
    this.loadQuestion();
    this.startTimer();
  }

  async finish(
    title: string,
    message: string,
    endingType: string
  ): Promise<void> {
    this.clearTimer();

    let modal: HTMLIonModalElement | null = null;
    let prizeToSend: number = 0; // Variável para armazenar o prêmio correto

    // Determina o prêmio a ser enviado
    if (endingType === 'wrongAnswer') {
      prizeToSend = this.prizeInfo?.wrongAnswer || 0; // Se errou, envia o prêmio para erro
    } else if (endingType === 'quit') {
      prizeToSend = this.prizeInfo?.quit || 0; // Se parou, envia o prêmio para parar
    } else {
      prizeToSend = this.prizeInfo?.correctAnswer || 0; // Se o jogo terminou normalmente
    }

    try {
      modal = await this.modalCtrl.create({
        component: EndingPage,
        componentProps: {
          title,
          message,
          endingType,
          totalPrize: prizeToSend, // Passando o prêmio específico para o modal
          numeroQuestoes: this.numQuestionsPlayed, // Passando o número de questões
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
      const modal = await this.modalCtrl.getTop(); // Verifica se existe um modal ativo no topo
      if (modal) {
        await modal.dismiss(); // Fecha o modal se ele existir
      }
    } catch (error) {
      console.error('Erro ao tentar fechar o modal:', error);
    }
  }

  // Inicia o temporizador
  private startTimer(): void {
    this.clearTimer();
    this.intervalID = setInterval(() => {
      if (--this.timeLeft === 0) {
        this.clearTimer();
        this.finish('Fim de jogo', 'Seu tempo acabou!', 'timeout');
      }
    }, 1000);
  }

  // Limpa o temporizador
  private clearTimer(): void {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }

  giveUp(): void {
    this.finish('Fim de jogo', 'Você parou!', 'quit');
  }

  // O jogador responde
  doAnswer(answer: QuestionAnswer): void {
    this.speakText(answer.description);

    if (answer.isRight) {
      this.speakText('Certa resposta');
      this.blinkScreen('correct-answer-blink');
      this.numQuestionsPlayed++;
      setTimeout(() => this.loadQuestion(), 500);
    } else {
      this.speakText('Você errou');
      this.blinkScreen('wrong-answer-blink');
      this.numQuestionsPlayed++;
      setTimeout(
        () => this.finish('Fim de jogo', 'Você errou!', 'wrongAnswer'),
        500
      );
    }
  }

  // Função para piscar a tela
  blinkScreen(className: string): void {
    this.answerClass = className;
    setTimeout(() => (this.answerClass = ''), 1500);
  }
}
