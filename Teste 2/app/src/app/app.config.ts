import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

import { routes } from './app.routes';
import { zaiAuthInterceptor } from './core/interceptors/zai.interceptor';

const WhatsAppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e8faf0',
      100: '#c3f1d4',
      200: '#9be8b5',
      300: '#70df95',
      400: '#4ed87c',
      500: '#25d366',
      600: '#1fb85a',
      700: '#189d4d',
      800: '#12833f',
      900: '#075e54',
      950: '#054d44',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([zaiAuthInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: WhatsAppPreset,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
};
