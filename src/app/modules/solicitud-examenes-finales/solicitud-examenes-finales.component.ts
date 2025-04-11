import { Component, inject, OnInit, signal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { ExamenesFinalesService } from './service/examenes-finales.service';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { SharedModule } from '@shared/shared.module';
import { ExamenesFinales_Materias } from './examenes.interfaces';
import { HeaderTable } from '@shared/interfaces/header-tables';
import { MatDialog } from '@angular/material/dialog';
import { SolicitudComponent } from './dialogs/solicitud';

@Component({
    selector: 'app-solicitud-examenes-finales',
    imports: [
        MatToolbar,
        MatCard,
        MatCardContent,
        MatIcon,
        MatCardHeader,
        SharedModule,
    ],
    templateUrl: './solicitud-examenes-finales.component.html',
    styleUrl: './solicitud-examenes-finales.component.scss'
})
export class SolicitudExamenesFinalesComponent implements OnInit {
  Service = inject(ExamenesFinalesService);

  protected Head = HEAD;
  response = signal<any>([]);
  responseHistorico = signal<any>([]);
  data = signal<any>([]);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.Service.consultar().subscribe((result: any) => {
      this.response.set(result[0]);
      this.Service.consultarHistorico().subscribe((result: any) => {
        console.log(result[0]);
        this.responseHistorico.set(result[0]);
      });
    });

    this.Service.consultarMaterias().subscribe(
      (result: ExamenesFinales_Materias[]) => {
        const listaMaterias = result.map((e: ExamenesFinales_Materias) => {
          return {
            ...e,
            button_solicitar: {
              label: 'solicitar',
              type: 1,
              fun: () => {
                this.Service.validarExtraordinario(e.idCodigo).subscribe(
                  (r) => {
                    console.log(r);
                    this.openDialog(r);
                  },
                );
              },
            },
            button_cancelar: {
              label: 'cancel',
              fun: () => {},
            },
          };
        });
        this.data.set(listaMaterias);
        console.log(listaMaterias);
      },
    );
  }

  openDialog(r: any[]): void {
    const dialogRef = this.dialog.open(SolicitudComponent, {
      data: { motivo: r },
    });
  }
}

export const HEAD: HeaderTable[] = [
  { label: 'Codigo', namePropiedad: 'idCodigo' },
  { label: 'Materia', namePropiedad: 'materia' },
  { label: 'Seccion', namePropiedad: 'seccion' },
  { label: 'Solicitada', namePropiedad: 'solicitada' },
  { label: 'Pago', namePropiedad: 'pago' },
  { label: 'Fecha Examen Solicitado', namePropiedad: 'fecha' },
  // { label: ' ', namePropiedad: 'button_cancelar', button: [{}] },
  { label: '  ', namePropiedad: 'button_solicitar', button: [{}] },
];
