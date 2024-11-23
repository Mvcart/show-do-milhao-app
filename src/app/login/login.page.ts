import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router // Use Router para navegação
  ) {}

  login(): void {
    const success = this.authService.login(this.username, this.password);
    if (success) {
      const redirectUrl = this.authService.redirectUrl || '/menu';
      this.router.navigate([redirectUrl]);
    } else {
      alert('Usuário ou senha inválidos!');
    }
  }  
}