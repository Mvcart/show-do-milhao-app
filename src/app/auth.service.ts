import { Injectable } from '@angular/core';
import { SecureStorageService } from './secure-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  redirectUrl: string | null = null; // Propriedade adicionada

  login(username: string, password: string): boolean {
    if (username === 'jushow' && password === 'senha123') {
      SecureStorageService.setItem('isLoggedIn', true);
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  logout(): void {
    SecureStorageService.removeItem('isLoggedIn');
    this.isAuthenticated = false;
    this.redirectUrl = null; // Limpa o redirecionamento
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || SecureStorageService.getItem('isLoggedIn');
  }
}
