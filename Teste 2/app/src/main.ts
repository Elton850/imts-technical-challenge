import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Bootstrap da aplicação. Em produção, o erro pode ser enviado a um serviço de
 * monitoramento (ex.: Sentry); nunca incluir dados sensíveis (token, PII) no log.
 */
bootstrapApplication(AppComponent, appConfig).catch((err) => {
  console.error('Falha no bootstrap da aplicação.', err instanceof Error ? err.message : err);
});
