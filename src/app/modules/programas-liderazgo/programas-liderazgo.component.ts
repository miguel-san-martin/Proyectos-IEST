import {
  Component,
  effect,
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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { map, take } from 'rxjs';
import { Periodo, Programa } from './Periodo.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialogs/dialog-alta/dialog.component';
import { MenuTemplateDirectiveDirective } from '@shared/directives/menu-template-directive.directive';
import { MatMenuItem } from '@angular/material/menu';
import { HEADERS_TABLE } from './HEADERS_TABLE';
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
  @ViewChild('table') table!: TableIestV2Component<any>;
  @ViewChild('input') input!: ElementRef;

  periodos = signal<Periodo[] | null>(null);
  programas = signal<Programa[] | null>(null);
  alumnos = signal<any>([]);
  filtersignal = model('');

  filterPago: ModelSignal<string | null> = model<null | string>(null);
  filterTipoBaja: ModelSignal<string | null> = model<null | string>(null);

  filterBar = signal(false);

  constructor() {
    effect(() => {
      console.log(this.filterTipoBaja());
      console.log(this.filterPago());
      this.consultarAlumnos();
    });
  }

  public filter: string = '';

  protected miFormulario = new FormGroup({
    idPeriodo: new FormControl(null),
    idPrograma: new FormControl(null),
  });

  ngOnInit(): void {
    this.toogleFilterBar();
    this.getPeriodos();
    this.getProgramas();
    this.consultarAlumnos();
    this.miFormulario.valueChanges.subscribe((valores) => {
      console.log('Formulario cambiado:', valores);
      this.consultarAlumnos();
    });
  }

  private getProgramas() {
    this.Service.getIdProgramas().subscribe((data: Programa[]) => {
      // console.log(data);
      this.programas.set(data);
    });
  }
  private getPeriodos() {
    this.Service.getPeriodos()
      .pipe(
        map((periodos: any) =>
          periodos.sort((a: any, b: any) => b.idPeriodo - a.idPeriodo),
        ),
      )
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

  private consultarAlumnos() {
    // console.log(this.miFormulario.value);
    const { idPeriodo, idPrograma } = this.miFormulario.value;

    this.Service.getListadoAlumnos({ idPrograma, idPeriodo })
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.postGetFilters(data);
          // this.alumnos.set(data);
        },
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
    dialogRef.afterClosed().subscribe((v) => {
      if (v === undefined) return;
      switch (accion) {
        case 'termino-programa':
          Service = this.Service.terminoDelPrograma(idRegistro);
          break;
        case 'definitiva':
          Service = this.Service.bajaDefinitiva(idRegistro, v);
          break;
        case 'eliminar':
          Service = this.Service.eliminarRegistro(idRegistro, v);
          break;
        case 'temporal':
          Service = this.Service.bajaTemporal(idRegistro, v);
          break;
        case 'deshacer-temporal':
          Service = this.Service.deshacerTemporal(idRegistro, v);
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

  protected readonly HEADERS_TABLE = HEADERS_TABLE;

  postGetFilters(data: any[]) {
    if (this.filterTipoBaja()) {
      console.log(this.filterTipoBaja());
      switch (this.filterTipoBaja()) {
        case 'Baja Temporal':
          data = data.filter((a) => a.fechaBajaTem);
          console.log(data);
          break;
        case 'Baja Definitiva':
          data = data.filter((a) => a.fechaBaja);
          break;
        case 'Terminacion de Programa':
          data = data.filter((a) => a.fechaTermino);
          break;
      }
    }
    if (this.filterPago()) {
      switch (this.filterPago()) {
        case 'SI':
          data = data.filter((a) => a.statusPago === 'SI');
          break;
        case 'NO':
          data = data.filter((a) => a.statusPago === 'NO');
          break;
      }
    }
    this.alumnos.set(data);
  }

  private toogleFilterBar() {}
}
