import {
  Component,
  ElementRef,
  inject,
  model,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { LiderazgoService } from './services/programa-liderazgo.service';
import { MaterialModule } from '../../shared-material-module/material.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { take } from 'rxjs';
import {
  Estatus,
  Generaciones,
  Pago,
  Periodo,
  Programa,
} from './interfaces/Periodo.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialogs/dialog-alta/dialog.component';
import { MenuTemplateDirectiveDirective } from '@shared/directives/menu-template-directive.directive';
import { MatMenuItem } from '@angular/material/menu';
import { HEADERS_TABLE } from './interfaces/HEADERS_TABLE';
import { TableIestV2Component } from '@shared/components/table-iest-v2/table-iest-v2.component';
import { CommonModule } from '@angular/common';
import { DialogBajaComponent } from './dialogs/dialog-baja/dialog.component';
import { DialogInfoComponent } from './dialogs/dialog-info/dialog.component';

export type tipo_baja =
  | 'temporal'
  | 'definitiva'
  | 'termino-programa'
  | 'eliminar'
  | 'deshacer-temporal';

export interface datosApi {
  periodos: Periodo[];
  programas: Programa[];
  pagos: Pago[];
  estatus: Estatus[];
  generaciones: Generaciones[];
}

@Component({
  selector: 'app-programas-liderazgo',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    MenuTemplateDirectiveDirective,
    MatMenuItem,
    CommonModule,
  ],
  templateUrl: './programas-liderazgo.component.html',
  styleUrl: './programas-liderazgo.component.scss',
})
export class ProgramasLiderazgoComponent implements OnInit {
  readonly Service = inject(LiderazgoService);
  readonly dialog = inject(MatDialog);
  readonly fb = inject(FormBuilder);

  @ViewChild('table') table!: TableIestV2Component<any>;
  @ViewChild('input') input!: ElementRef;

  datos = signal<datosApi>({
    periodos: [],
    programas: [],
    pagos: [],
    estatus: [],
    generaciones: [],
  });

  alumnos = signal<any>([]);
  errorDeEmails = signal<string>('');

  filtersignal = model('');

  protected miFormulario = this.fb.group({
    idPeriodo: [-1],
    idPrograma: [-1],
    idEstatus: [-1],
    idGeneracion: [-1],
    pagado: [-1],
  });

  protected readonly HEADERS_TABLE = HEADERS_TABLE;

  ngOnInit(): void {
    this.poblarSelects();
    this.consultarAlumnos();
  }

  private poblarSelects() {
    this.getPeriodos();
    this.getGeneraciones();
    this.getEstatus();
    this.getPeriodos();
    this.getTiposPagos();
    this.getProgramas();
  }

  // listadoProgramas
  private getProgramas() {
    this.Service.getIdProgramas().subscribe((data: Programa[]) => {
      this.datos.update((old) => {
        old.programas = [...data];
        return old;
      });
    });
  }

  // consultaPeriodos
  private getPeriodos() {
    this.Service.getPeriodos()
      .pipe(take(1))
      .subscribe({
        next: (data: Periodo[]) => {
          this.datos.update((old) => {
            old.periodos = [...data];
            return old;
          });
        },
      });
  }

  // consultaPagos
  private getTiposPagos() {
    this.Service.getPagos()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          // this.pagos.set(data);
          this.datos.update((old) => {
            old.pagos = [...data];
            return old;
          });
        },
      });
  }

  // consultaEstatus
  private getEstatus() {
    this.Service.getEstatus()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          // this.estatus.set(data);
          this.datos.update((old) => {
            old.estatus = [...data];
            return old;
          });
        },
      });
  }

  // consultaGeneracion
  private getGeneraciones() {
    this.Service.getGemeracion()
      .pipe(take(1))
      .subscribe({
        next: (data: Generaciones[]) => {
          // this.generaciones.set(data);
          this.datos.update((old) => {
            old.generaciones = [...data];
            return old;
          });
        },
      });
  }

  protected consultarAlumnos() {
    console.log(this.datos());
    // console.log(this.miFormulario.value);
    let { idPeriodo, idPrograma, idGeneracion, idEstatus, pagado } = {
      ...this.miFormulario.value,
    };

    if (idPeriodo && idPeriodo < 0) idPeriodo = null;
    if (idPrograma && idPrograma < 0) idPrograma = null;
    if (idGeneracion && idGeneracion < 0) idGeneracion = null;
    if (idEstatus && idEstatus < 0) idEstatus = null;
    if (pagado && pagado < 0) pagado = null;

    const payload = { idPeriodo, idPrograma, idGeneracion, idEstatus, pagado };

    this.Service.getListadoAlumnos(payload)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.alumnos.set(data);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  protected addNuevoIngreso() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        programas: this.datos().programas,
        periodos: this.datos().periodos,
        generaciones: this.datos().generaciones,
      },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  protected bajaAlumno(accion: tipo_baja, idRegistro: number) {
    let Service;

    const dialogRef = this.dialog.open(DialogBajaComponent, {
      data: { accion },
    });
    //Dialogo de registro
    dialogRef.afterClosed().subscribe((motivoBaja) => {
      if (motivoBaja === undefined) return;
      switch (accion) {
        case 'termino-programa':
          Service = this.Service.terminoDelPrograma({ idRegistro });
          break;
        case 'definitiva':
          Service = this.Service.bajaDefinitiva({ idRegistro, motivoBaja });
          break;
        case 'eliminar':
          Service = this.Service.eliminarRegistro({ idRegistro, motivoBaja });
          break;
        case 'temporal':
          Service = this.Service.bajaTemporal({ idRegistro, motivoBaja });
          break;
        case 'deshacer-temporal':
          Service = this.Service.deshacerTemporal({ idRegistro, motivoBaja });
          break;
        default:
          throw new Error('No se encontraron el programa');
      }

      Service.pipe(take(1)).subscribe({
        next: (info: unknown) => {
          console.log(info);
          const dialogRef = this.dialog.open(DialogInfoComponent, {
            data: { info: info },
          });
          dialogRef.afterClosed().subscribe(() => {
            this.consultarAlumnos();
          });
        },
      });
    });
  }

  // consultaAlumnos
  mailTo() {
    const checkedList = this.table.dataSource.data.filter(
      (row) => row.selected == true,
    );
    const emails = checkedList.map((row) => row.correo);
    const subject = 'Asunto del correo';
    const body = 'Cuerpo del correo';
    console.log(emails);
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emails.join(',')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (emails.length > 299)
      return this.errorDeEmails.set('El limite de correos es 300');

    this.errorDeEmails.set('');

    window.open(
      mailtoLink,
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=yes',
    );
  }
}
