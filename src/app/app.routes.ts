import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pagares',
    loadChildren: () =>
      import('./modules/pagares/pagares.module').then((m) => m.PagaresModule),
  },
];
