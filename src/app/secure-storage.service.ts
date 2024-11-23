import * as CryptoJS from 'crypto-js';

const secretKey = 'sua-chave-secreta'; //substitua por uma chave segura

export class SecureStorageService {
    static setItem(key: string, value: any): void {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();
      localStorage.setItem(key, encrypted);
    }
  
    static getItem(key: string): any {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
  
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        console.error('Erro na descriptografia:', e);
        return null;
      }
    }
  
    static removeItem(key: string): void {
      localStorage.removeItem(key);
    }
  }