import { Routes } from '@angular/router';
import { bibliotecaGuard } from './modules/sanciones-biblioteca/guards/busqueda-guard';

export const routes: Routes = [
  // {
  //   path: 'pagares',
  //   loadChildren: () =>
  //     import('./modules/pagares/pagares.module').then((m) => m.PagaresModule),
  // },
  // {
  //   path: 'camp',
  //   loadChildren: () =>
  //     import('./modules/camping/camping.module').then((m) => m.CampingModule),
  // },
  // {
  //   path: 'shirt-sale',
  //   loadChildren: () =>
  //     import('./modules/shirt-sale/shirt-sale.module').then(
  //       (m) => m.ShirtSaleModule,
  //     ),
  // },
  // {
  //   path: 'module-closed',
  //   loadComponent: () =>
  //     import('./pages/modulo-cerrado/modulo-cerrado.component').then(
  //       (c) => c.ModuloCerradoComponent,
  //     ),
  // },
  // {
  //   path: 'partidas-presupuestales',
  //   loadComponent: () =>
  //     import(
  //       './modules/partidas-presupuestales/pages/partidas-presupuestales-main-page/partidas-presupuestales-main-page.component'
  //     ).then((c) => c.PartidasPresupuestalesMainPageComponent),
  // },
  // {
  //   path: 'config-escolares',
  //   loadComponent: () =>
  //     import(
  //       './modules/admin-config-configuracion/page-config/page-config.component'
  //     ).then((c) => c.PageConfigComponent),
  //   //canActivate: [accesoEscolarConfGuard],
  // },
  // {
  //   path: 'esp-bachiller',
  //   loadComponent: () =>
  //     import(
  //       './modules/especialidad-bachiller/main-page/main-page.component'
  //     ).then((c) => c.MainPageComponent),
  // },
  // {
  //   path: 'nu',
  //   loadComponent: () =>
  //     import('./modules/calculadora-nu/calculadora-nu.component').then(
  //       (c) => c.CalculadoraNuComponent,
  //     ),
  // },
  // {
  //   path: 'module-closed',
  //   loadComponent: () =>
  //     import('./pages/modulo-cerrado/modulo-cerrado.component').then(
  //       (c) => c.ModuloCerradoComponent,
  //     ),
  // },
  {
    path: 'no-permits',
    loadComponent: () =>
      import('./pages/no-permisos/no-permisos.component').then(
        (c) => c.NoPermisosComponent,
      ),
  },
  {
    path: 'login-screen',
    loadComponent: () =>
      import('./pages/login-screen/login-screen.component').then(
        (c) => c.LoginScreenComponent,
      ),
  },
  // {
  //   path: 'prospectos',
  //   loadComponent: () =>
  //     import(
  //       './modules/buscador-prospectos/buscador-prospectos.component'
  //     ).then((c) => c.BuscadorProspectosComponent),
  // },
  // {
  //   path: 'concurso',
  //   // canActivate: [accesoEscolarConfGuard],
  //   loadChildren: () =>
  //     import(
  //       './modules/grupo-concurso-maestro/grupo-concurso-maestro.module'
  //     ).then((m) => m.GrupoConcursoMaestroModule),
  // },
  // {
  //   path: 'busqueda-pagares',
  //   loadComponent: () =>
  //     import(
  //       './modules/busqueda-pagares/components/layout/layout.component'
  //     ).then((c) => c.LayoutComponent),
  // },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [bibliotecaGuard],
    loadComponent: () =>
      import(
        './modules/sanciones-biblioteca/sanciones-biblioteca.component'
      ).then((c) => c.SancionesBibliotecaComponent),
    // redirectTo: 'busqueda',
  },
  // {
  //   path: 'programas-liderazgo',
  //   canActivate: [programaLiderasgoGuard],
  //   loadComponent: () =>
  //     import(
  //       './modules/programas-liderazgo/programas-liderazgo.component'
  //     ).then((c) => c.ProgramasLiderazgoComponent),
  // },
  // {
  //   path: 'busqueda',
  //   canActivate: [programaLiderasgoGuard],
  //   loadComponent: () =>
  //     import(
  //       './modules/rep-busca-id-person/rep-busca-id-person.component'
  //     ).then((c) => c.REPBuscaIdPersonComponent),
  // },
];
