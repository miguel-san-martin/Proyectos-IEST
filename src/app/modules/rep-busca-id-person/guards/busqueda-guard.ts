import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { BuscadorPersonaService } from '../service/buscador-persona.service';

export const BusquedaIDGuard: CanActivateFn = () => {
  const router = inject(Router);
  const myService = inject(BuscadorPersonaService);

  return myService
    .consultar({ vNombre: '', vApellidoP: '', vApellidoM: '' })
    .pipe(
      tap((response: any) => {
        if (response?.sucess === '2') {
          console.log('!!');
          return router.navigate(['/login-screen']);
        }
        return true;
      }),
    );
};
