import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { StartGamePage } from '../start-game/start-game.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  async toStartGame() {
    const modal = await this.modalCtrl.create({
      component: StartGamePage,  // O modal a ser exibido
    });
    return await modal.present(); // Exibe o modal
  }

  toEditQuestions() {
    this.navCtrl.navigateForward('/manage-questions');
  }
}