import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AudioService } from '../audio.service'; // Importar o serviço de áudio
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.page.html',
  styleUrls: ['./start-game.page.scss'],
})

export class StartGamePage {
  valorRodada: number = 0;  // Variável para armazenar o valor da rodada
  numeroQuestoes: number = 0;  // Variável para armazenar o número de questões
  selectedMusic: File | null = null;  // Variável para armazenar o arquivo de música

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private audioService: AudioService, // Injeta o serviço de áudio
    private questionService: QuestionService // Injeta o serviço de perguntas
  ) {}
  
  // Função chamada quando o usuário seleciona um arquivo de música
  onMusicFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio')) {
      this.selectedMusic = file;
    }
  }

  // Função para iniciar o jogo e tocar a música
  async iniciarJogo() {
    if (this.selectedMusic) {
      this.audioService.playMusic(this.selectedMusic); // Toca a música
    }

    if (this.valorRodada > 0 && this.numeroQuestoes > 0) {
      // Navegar para a página de perguntas
      await this.navCtrl.navigateForward('/question', {
        queryParams: { totalPrize: this.valorRodada, numeroQuestoes: this.numeroQuestoes }
      });

      // Fecha o modal após a navegação
      await this.modalCtrl.dismiss();
    } else {
      console.error('Por favor, insira valores válidos para a rodada e o número de questões.');
      return; // Impede o início do jogo se os valores forem inválidos
    }
  }  

  // Função para cancelar e redirecionar para o menu
  async cancelar() {
    // Navega para a página do menu
    await this.navCtrl.navigateRoot('/menu').catch(err => {
      console.error('Erro na navegação para o menu:', err);
    });

    // Fecha o modal após a navegação
    await this.modalCtrl.dismiss();
  }
}