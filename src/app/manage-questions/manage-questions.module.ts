import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageQuestionsPageRoutingModule } from './manage-questions-routing.module';

import { ManageQuestionsPage } from './manage-questions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageQuestionsPageRoutingModule
  ],
  declarations: [ManageQuestionsPage]
})
export class ManageQuestionsPageModule {}
