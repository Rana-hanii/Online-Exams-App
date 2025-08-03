import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers:
   [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), provideClientHydration(withEventReplay()),
     provideAnimationsAsync(),
     MessageService,
           providePrimeNG({
          theme: {
              preset: Aura
          }
      })]
};
