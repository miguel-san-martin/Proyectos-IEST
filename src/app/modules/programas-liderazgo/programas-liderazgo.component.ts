import {
  Component,
  ElementRef,
  inject,
  model,
  ModelSignal,
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

  periodos = signal<Periodo[] | null>(null);
  programas = signal<Programa[] | null>(null);
  pagos = signal<Pago[] | null>(null);
  estatus = signal<Estatus[] | null>(null);
  generaciones = signal<Generaciones[] | null>(null);

  alumnos = signal<any>([]);

  filtersignal = model('');
  filterPago: ModelSignal<string | null> = model<null | string>(null);
  filterTipoBaja: ModelSignal<string | null> = model<null | string>(null);

  public filter: string = '';

  protected miFormulario = this.fb.group({
    idPeriodo: [null],
    idPrograma: [null],
    idEstatus: [null],
    idGeneracion: [null],
    pagado: [null],
  });

  protected readonly HEADERS_TABLE = HEADERS_TABLE;

  ngOnInit(): void {
    this.poblarSelects();
    this.consultarAlumnos();
    this.miFormulario.valueChanges.subscribe((value) => {
      this.consultarAlumnos();
    });
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
      // console.log(data);
      this.programas.set(data);
    });
  }

  // consultaPeriodos
  private getPeriodos() {
    this.Service.getPeriodos()
      .pipe(take(1))
      .subscribe({
        next: (periodos: any) => {
          console.log(periodos);

          // periodos.forEach((periodo: any) => {
          //   if (periodo.actual == 1)
          //     this.miFormulario.get('idPeriodo')?.setValue(periodo.idPeriodo);
          // });
          this.periodos.set(periodos);
        },
      });
  }

  // consultaPagos
  private getTiposPagos() {
    this.Service.getPagos()
      .pipe(take(1))
      .subscribe({
        next: (data) => this.pagos.set(data),
      });
  }

  // consultaEstatus
  private getEstatus() {
    this.Service.getEstatus()
      .pipe(take(1))
      .subscribe({
        next: (data) => this.estatus.set(data),
      });
  }

  // consultaGeneracion
  private getGeneraciones() {
    this.Service.getGemeracion()
      .pipe(take(1))
      .subscribe({
        next: (data) => console.log,
      });
  }

  protected consultarAlumnos() {
    // console.log(this.miFormulario.value);
    const { idEstatus, pagado, idPrograma, idGeneracion, idPeriodo } = {
      ...this.miFormulario.value,
    };

    this.Service.getListadoAlumnos({
      idEstatus,
      pagado,
      idPrograma,
      idGeneracion,
      idPeriodo,
    })
      .pipe(take(1))
      .subscribe({
        next: (data) => {},
        error: (error) => {
          console.log(error);
        },
      });
  }

  protected addNuevoIngreso() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { programas: this.programas(), periodos: this.periodos() },
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
        next: (info: any) => {
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
}
