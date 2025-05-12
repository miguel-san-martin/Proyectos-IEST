import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { ServicioBibliotecaService } from '../service/servicio-biblioteca.service';

export const bibliotecaGuard: CanActivateFn = () => {
  const router = inject(Router);
  const myService = inject(ServicioBibliotecaService);

  return myService.getAllIncidencias().pipe(
    tap((response: any) => {
      console.log(response);
      if (response.success == 2) {
        console.log('!!');
        return router.navigate(['/login-screen']);
      }
      return true;
    }),
  );
};
