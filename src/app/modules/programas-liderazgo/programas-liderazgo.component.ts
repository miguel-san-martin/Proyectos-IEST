import {
  Component,
  ElementRef,
  inject,
  model,
  signal,
  ViewChild,
} from '@angular/core';
import { LiderazgoService } from './services/programa-liderazgo.service';
import { MaterialModule } from '../../shared-material-module/material.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { forkJoin, take } from 'rxjs';
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
import { GenDialogComponent } from './dialogs/dialog-alta-gen/dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type tipo_baja =
  | 'temporal'
  | 'definitiva'
  | 'termino-programa'
  | 'eliminar'
  | 'deshacer-temporal'
  | 'completar-gen';

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
export class ProgramasLiderazgoComponent {
  readonly Service = inject(LiderazgoService);
  readonly dialog = inject(MatDialog);
  readonly fb = inject(FormBuilder);
  readonly snackBar = inject(MatSnackBar);

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

  private ngOnInit(): void {
    this.poblarSelects();
    this.consultarAlumnos();
  }

  private poblarSelects() {
    const peticiones = [
      this.Service.getGeneracion(),
      this.Service.getPeriodos(),
      this.Service.getEstatus(),
      this.Service.getPagos(),
      this.Service.getIdProgramas(),
    ];

    forkJoin(peticiones).subscribe(
      ([generaciones, periodos, estatus, pagos, programas]) => {
        console.log(generaciones, periodos, estatus, pagos, programas);
        this.datos.set({
          periodos,
          generaciones,
          estatus,
          pagos,
          programas,
        });
      },
    );
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
    this.Service.getGeneracion()
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
    const elementoActual: Periodo | undefined = this.datos().periodos.find(
      (periodo: Periodo) => periodo.actual == 1,
    );
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        programas: this.datos().programas,
        periodos: [elementoActual],
        generaciones: this.datos().generaciones,
      },
    });

    dialogRef.afterClosed().subscribe((exit) => {
      if (exit == 0) {
        this.openSnackBar('Alumno dado de alta', 'Ok');
      } else {
        this.openSnackBar('Error', 'Cerrar');
      }
    });
  }

  protected bajaAlumno(accion: tipo_baja, idRegistro: number) {
    let Service;
    let dialogRef;

    if (accion != 'completar-gen') {
      dialogRef = this.dialog.open(DialogBajaComponent, {
        data: { accion, periodoActual: this.datos() },
      });
    } else {
      dialogRef = this.dialog.open(GenDialogComponent, {
        data: { accion, generaciones: this.datos().generaciones },
      });
    }

    //Dialogo de registro
    dialogRef.afterClosed().subscribe((motivoBaja: string) => {
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
        case 'completar-gen':
          Service = this.Service.setGeneracion({
            idRegistro,
            idGeneracion: Number(motivoBaja),
          });
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
  protected mailTo() {
    const checkedList = this.table.dataSource.data.filter(
      (row) => row.selected == true,
    );
    const emails = checkedList.map((row) => row.correo);
    const subject = 'Asunto del correo';
    const body = 'Cuerpo del correo';
    console.log(emails);
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emails.join(',')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (emails.length > 299) {
      this.dialog.open(DialogInfoComponent, {
        data: {
          info: [
            {
              mensaje:
                'Solo se puede seleccionar un máximo de 300 alumnos, por favor use un filtro mayor para limitar la cantidad.',
            },
          ],
        },
      });
      return;
    }

    this.errorDeEmails.set('');

    window.open(
      mailtoLink,
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=yes',
    );
  }

  protected openSnackBar(message: string, action: string) {
    const config: MatSnackBarConfig = {
      duration: 3000,
    };
    this.snackBar.open(message, action, config);
  }
}
