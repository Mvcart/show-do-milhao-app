import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  redirectUrl: string | null = null; // URL para redirecionar após login

  login(username: string, password: string): boolean {
    if (username === 'cliente' && password === 'senha') {
      this.isAuthenticated = true;
      localStorage.setItem('auth', 'true');
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('auth');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || localStorage.getItem('auth') === 'true';
  }
}