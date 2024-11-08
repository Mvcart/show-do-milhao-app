import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioPlayer: HTMLAudioElement | null = null;

  // Função para iniciar ou retomar o áudio
  playMusic(file?: File): void {
    if (file) {
      // Inicia a música com o arquivo fornecido
      const musicURL = URL.createObjectURL(file);
      this.audioPlayer = new Audio(musicURL);
      this.audioPlayer.loop = true; // Define o áudio para tocar em loop
      this.audioPlayer.play();
    } else if (this.audioPlayer) {
      // Retoma a música se já houver um arquivo carregado
      this.audioPlayer.play();
    }
  }

  // Função para pausar o áudio
  pauseMusic(): void {
    if (this.audioPlayer && !this.audioPlayer.paused) {
      this.audioPlayer.pause();
    }
  }

  // Função para parar o áudio
  stopMusic(): void {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0; // Reinicia o áudio
    }
  }

  // Função para verificar se o áudio está tocando
  isPlaying(): boolean {
    return this.audioPlayer !== null && !this.audioPlayer.paused;
  }

  // Função para ajustar o volume
  setVolume(volume: number): void {
    if (this.audioPlayer) {
      this.audioPlayer.volume = volume;
    }
  }
}