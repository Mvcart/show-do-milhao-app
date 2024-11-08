import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageQuestionsPage } from './manage-questions.page';

const routes: Routes = [
  {
    path: '',
    component: ManageQuestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageQuestionsPageRoutingModule {}
