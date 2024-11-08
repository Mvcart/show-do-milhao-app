import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-ending',
  templateUrl: './ending.page.html',
  styleUrls: ['./ending.page.scss'],
})
export class EndingPage implements OnInit {
  @Input() title: string = '';         // Título do fim do jogo (ex: "Fim do jogo")
  @Input() message: string = '';       // Mensagem do fim do jogo (ex: "Você errou!")
  @Input() endingType: string = '';    // Tipo de término (ex: "quit", "wrongAnswer", "win")
  @Input() totalPrize: number = 0;    // O prêmio total do jogador
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
  }

  // Método para reiniciar o jogo
  async iniciarNovoJogo() {
    this.questionService.resetGame(this.numeroQuestoes);  // Passa o número de questões ao resetar
    const modal = await this.modalCtrl.getTop();
    if (modal) {
      await this.modalCtrl.dismiss();
    }
    this.navCtrl.navigateRoot('/start-game');
  }

  // Ir para o menu principal
  async irParaMenu() {
    this.questionService.resetGame(this.numeroQuestoes);  // Passa o número de questões ao resetar
    const modal = await this.modalCtrl.getTop();
    if (modal) {
      await this.modalCtrl.dismiss();
    }
    this.navCtrl.navigateRoot('/menu');
  }
}
