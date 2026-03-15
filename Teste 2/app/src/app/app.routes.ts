import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'whatsanalizer',
    loadComponent: () =>
      import('./features/whatsanalizer/whatsanalizer.component').then(
        (m) => m.WhatsAnalizerComponent
      ),
    title: 'AI Chat Insights - WhatsAnalizer',
  },
  {
    path: '',
    redirectTo: 'whatsanalizer',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'whatsanalizer',
  },
];
