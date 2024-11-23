import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { SecureStorageService } from './secure-storage.service';
import { AuthService } from './auth.service';
import { QuestionService } from './manage.questions.service';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule, // Necessário para ngModel nos formulários
  ],
  providers: [SecureStorageService, AuthService, QuestionService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
