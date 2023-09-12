/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

// Agrega las siguientes líneas
import * as cors from 'cors';

import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

cors({ origin: 'http://localhost:8000' }); // Ajusta el origen adecuado

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
