import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { appEffects } from './store/app.effects';
import { appReducers } from './store/app.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([tokenInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' }), withViewTransitions(), withHashLocation()),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    MessageService,
    providePrimeNG({
        theme: {
            preset: Aura,
        },
    }),
    provideStore(appReducers),
    provideEffects(appEffects),
    provideStoreDevtools({ 
      maxAge: 25, 
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
],
};
