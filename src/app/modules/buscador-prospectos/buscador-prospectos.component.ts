import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProspectosService } from './services/prospectos.service';
import { MaterialModule } from '../../shared-material-module/material.module';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';

export interface Prospecto {
  Nombre?: number;
  IDPERSON?: string;
  abrCarrera?: string;
  tieneBeca?: string;
  fechaRegistro?: string;
  porcentajeBeca?: number;
  montoRegistro?: number;
  porcentajePromocion?: number;
  monto?: number;
}
export type statusData = 'Recibida' | 'Vacia' | 'No Solicitada';

@Component({
  selector: 'app-buscador-prospectos',
  standalone: true,
  imports: [
    SharedModule,
    MaterialModule,
    MatButtonToggle,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgIf,
  ],
  templateUrl: './buscador-prospectos.component.html',
  styleUrl: './buscador-prospectos.component.scss',
})
export class BuscadorProspectosComponent implements OnInit {
  ProspectosService: ProspectosService = inject(ProspectosService);
  data = signal([]);
  dataSemaforo = signal<statusData>('No Solicitada');
  subject = signal<Prospecto | null>(null);
  readonly dialog = inject(MatDialog);
  formatoMoneda = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  iconMap = new Map();
  pares = [
    ['IID', 'factory'],
    ['LD', 'gavel'],
    ['LDAE', 'apartment'],
    ['LNI', 'work'],
    ['ICD', 'architecture'],
    ['ITIT', 'mouse'],
    ['LMC', 'stethoscope'],
    ['LP', 'psychology'],
    ['LAT', 'hotel'],
    ['IPER', 'oil_barrel'],
    ['IP', 'solar_power'],
  ];
  constructor(private http: HttpClient) {
    this.pares.forEach(([key, value]) => {
      this.iconMap.set(key, value);
    });
  }

  ngOnInit(): void {
    this.showCard({ IDPERSON: 24672 });
  }

  showCard({ IDPERSON }: any) {
    if (!IDPERSON) return alert('Error: ID no valida');
    this.ProspectosService.getInfo(IDPERSON)
      .pipe(
        // take(1),
        tap((data: any) => console.log(data)),
        map((data): Prospecto => {
          if (!data[0]) throw new Error('Error no se ha caputrado');
          return data[0];
        }),
      )
      .subscribe({
        next: (value: Prospecto) => {
          console.log({ ...value, IDPERSON });
          this.subject.set({ ...value, IDPERSON });
          this.dataSemaforo.set('Recibida');
        },
        error: () => {
          this.dataSemaforo.set('Vacia');
        },
      });
  }

  // edit() {
  //   const dialogRef = this.dialog.open(DialogEditComponent, {
  //     data: {},
  //   });
  // }

  getIcon(abr: string): string {
    // console.log(abr.slice(0, -2));
    const resp = this.iconMap.get(abr.slice(0, -2));
    if (!resp) {
      return 'square_foot';
    } else {
      return resp;
    }
  }
}
