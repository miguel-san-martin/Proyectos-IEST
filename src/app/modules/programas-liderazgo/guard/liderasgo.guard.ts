import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LiderazgoService } from '../services/programa-liderazgo.service';

export const programaLiderasgoGuard: CanActivateFn = () => {
  const router = inject(Router);
  const myService = inject(LiderazgoService);

  return myService.controlAcceso().pipe(
    tap((response: any) => {
      // if (response?.sucess === '2') {
      //   console.log('!!');
      //   return router.navigate(['/login-screen']);
      // }

      console.log(response);

      if (response[0].error === '2') {
        console.error(
          '                           ,---.\n' +
            '                          /    |\n' +
            '                         /     |\n' +
            ' ¡N O  P A S A R Á S !  /      |\n' +
            '                       /       |\n' +
            "                 ___,'        |\n" +
            "                <  -'          :\n" +
            "                 `-.__..--'``-,__\n" +
            '                    |o/  o ` :,.)_`>\n' +
            '                    :/ `     ||/)\n' +
            '                    (_.).__,-` |\\\n' +
            '                    /( `.``   `| :\n' +
            "                    '`-.)  `  ; ;\n" +
            '                    | `       /-<\n' +
            '                    |     `  /   `.\n' +
            "    ,-_-..____     /|  `    :__..-'\\\n" +
            "   /,'-.__\\  ``-./ :`      ;       \\\n" +
            '   ` `  `\\   :  (   `  /  ,   `. \\\n' +
            '     `    \\   |  | `   :  :     . \\\n' +
            '       `_  ))  :  ;     |  |      ): :\n' +
            "     (`-.-' ||  |    ` ;  ;       | |\n" +
            '      -_   `;;._   ( `  /  /_       | |\n' +
            "       `-.-.// ,'`-.___/_,'         ; |\n" +
            '          :: :     /     `     ,   /  |\n' +
            "           || |    (        ,' /   /   |\n" +
            "           ||                ,'   /    |\n",
        );
        router.navigate(['/no-permits'], {
          queryParams: { mensaje: response[0].mensaje },
        });
      }
      return true;
    }),
  );
};
