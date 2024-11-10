import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { QuestionService } from '../question.service';
import { StartGamePage } from '../start-game/start-game.page';

@Component({
  selector: 'app-ending',
  templateUrl: './ending.page.html',
  styleUrls: ['./ending.page.scss'],
})

export class EndingPage implements OnInit {
  @Input() title: string = ''; // Título do fim do jogo (ex: "Fim do jogo")
  @Input() message: string = ''; // Mensagem do fim do jogo (ex: "Você errou!")
  @Input() endingType: string = ''; // Tipo de término (ex: "quit", "wrongAnswer", "win")
  @Input() totalPrize: number = 0; // O prêmio total do jogador (garantir que é um número)
  @Input() numeroQuestoes: number = 0; // Número de questões restantes ou jogadas

  constructor(
    private questionService: QuestionService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    console.log('Ending Page');
    console.log('Prize Info:', this.totalPrize);
    console.log('Ending Type:', this.endingType);
    console.log('Número de Questões:', this.numeroQuestoes);

    // Falar o prêmio total ao carregar a página
    this.speakPrize();
  }

  // Método para falar o prêmio
  speakPrize() {
    const prizeFormatted = this.totalPrize.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    // Verifica se a API de Speech Synthesis está disponível
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `O prêmio total é de ${prizeFormatted}`
      );
      utterance.lang = 'pt-BR'; // Define o idioma para português brasileiro
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis API não é suportada neste navegador.');
    }
  }

  // Método para reiniciar o jogo
  async iniciarNovoJogo() {
    // Fechar o modal atual
    const modal = await this.modalCtrl.getTop();
    if (modal) {
      await this.modalCtrl.dismiss();
    }

    // Resetar o jogo e abrir o StartGamePage como modal
    this.questionService.resetGame(this.numeroQuestoes); // Passa o número de questões ao resetar
    const startGameModal = await this.modalCtrl.create({
      component: StartGamePage, // Especifica o componente StartGamePage que será aberto
      componentProps: {
        // Passa propriedades para o modal, se necessário
        numeroQuestoes: this.numeroQuestoes,
      },
    });
    await startGameModal.present();
  }

  // Ir para o menu principal
  async irParaMenu() {
    this.questionService.resetGame(this.numeroQuestoes); // Passa o número de questões ao resetar
    const modal = await this.modalCtrl.getTop();
    if (modal) {
      await this.modalCtrl.dismiss();
    }
    this.navCtrl.navigateRoot('/menu');
  }
}