import { Routes } from '@angular/router';
import { accesoEscolarConfGuard } from './guard/acceso-escolar-conf.guard';

export const routes: Routes = [
  {
    path: 'pagares',
    loadChildren: () =>
      import('./modules/pagares/pagares.module').then((m) => m.PagaresModule),
  }
];
