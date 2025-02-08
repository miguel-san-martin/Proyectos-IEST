import {
  Component,
  ElementRef,
  inject,
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
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialogs/dialog.component';
import { MenuTemplateDirectiveDirective } from '@shared/directives/menu-template-directive.directive';
import { MatMenuItem } from '@angular/material/menu';
import { HEADERS_TABLE } from './HEADERS_TABLE';
import { TableIestV2Component } from '@shared/components/table-iest-v2/table-iest-v2.component';
import { CommonModule } from '@angular/common';

export type baja =
  | 'temporal'
  | 'definitiva'
  | 'termino'
  | 'eliminar'
  | 'deshacer-temporal';
@Component({
  selector: 'app-programas-liderazgo',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    MatButtonToggle,
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

  alumnos = signal([]);

  filtersignal = signal('');

  public filter: string = '';

  protected miFormulario = new FormGroup({
    idPeriodo: new FormControl(100),
    idPrograma: new FormControl(2),
  });

  ngOnInit(): void {
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
          this.alumnos.set(data);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addNuevoIngreso() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { programas: this.programas(), periodos: this.periodos() },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  bajaAlumno(temporal: baja, idRegistro: number) {
    switch (temporal) {
      case 'temporal':
        this.Service.bajaTemporal(idRegistro, 'Prueba')
          .pipe(take(1))
          .subscribe({
            next: (data: any) => {
              console.log(data);
              this.consultarAlumnos();
              // console.log(this.input.nativeElement.value);
              // this.table.applyFilter(this.input.nativeElement.value);
            },
            error: (error: any) => {
              console.error(error);
            },
          });
        break;
      case 'definitiva':
        this.Service.bajaDefinitiva(idRegistro, 'Prueba')
          .pipe(take(1))
          .subscribe({
            next: (data: any) => {
              console.log(data);
            },
            error: (error: any) => {
              console.error(error);
            },
          });
        break;
      case 'termino':
        this.Service.terminoDelPrograma(idRegistro)
          .pipe(take(1))
          .subscribe({
            next: (data: any) => {
              console.log(data);
            },
            error: (error: any) => {
              console.error(error);
            },
          });
        break;
      case 'eliminar':
        this.Service.eliminarRegistro(idRegistro, 'Prueba')
          .pipe(take(1))
          .subscribe({
            next: (data: any) => {
              console.log(data);
            },
            error: (error: any) => {
              console.error(error);
            },
          });
        break;
      case 'deshacer-temporal':
        this.Service.deshacerTemporal(idRegistro, 'Prueba')
          .pipe(take(1))
          .subscribe({
            next: (data: any) => {
              console.log(data);
              this.consultarAlumnos();
              // console.log(this.input.nativeElement.value);
              // this.table.applyFilter(this.input.nativeElement.value);
            },
            error: (error: any) => {
              console.error(error);
            },
          });
        break;
    }
  }

  protected querySend($event: any) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.table.applyFilter(filterValue);
  }

  protected readonly HEADERS_TABLE = HEADERS_TABLE;
}
