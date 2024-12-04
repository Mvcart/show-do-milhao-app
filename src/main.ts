import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import * as CryptoJS from 'crypto-js';
(window as any).CryptoJS = CryptoJS; // Disponibiliza o CryptoJS no escopo global


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
