import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CampamentoIestService } from '../../modules/camping/services/campamento-iest.service';
import { tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-no-permisos',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './no-permisos.component.html',
  styleUrl: './no-permisos.component.scss',
})
export class NoPermisosComponent implements OnInit {
  Service = inject(CampamentoIestService);
  Router = inject(Router);
  ActivatedRoute = inject(ActivatedRoute);

  mensaje = 'El módulo no se encuentra disponible por el momento.';

  checkService(): void {
    this.Service.GetPeriods()
      .pipe(
        tap((response) => {
          console.log('entrada');
          if (Array.isArray(response)) {
            this.Router.navigateByUrl('/');
          }
        }),
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((params) => {
      this.mensaje = params['mensaje'] ?? this.mensaje;
    });
  }
}
