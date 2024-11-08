import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {

  constructor(private navCtrl: NavController) { }

  toQuestion() {
    this.navCtrl.navigateForward('/start-game');
  }

  toEditQuestions() {
    this.navCtrl.navigateForward('/manage-questions');
  }
}