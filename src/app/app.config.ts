import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers:
   [provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes, withHashLocation()), provideClientHydration(withEventReplay()),
     provideAnimationsAsync(),
     MessageService,
           providePrimeNG({
          theme: {
              preset: Aura
          }
      })]
};
