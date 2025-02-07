import { Component, inject, OnInit, signal } from '@angular/core';
import { LiderazgoService } from './services/programa-liderazgo.service';
import { MaterialModule } from '../../shared-material-module/material.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { map, take } from 'rxjs';
import { Periodo, Programa } from './Periodo.interface';
import { HeaderTable } from '@shared/interfaces/header-tables';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialogs/dialog.component';
import { MenuTemplateDirectiveDirective } from '@shared/directives/menu-template-directive.directive';
import { MatMenuItem } from '@angular/material/menu';

export type baja = 'temporal' | 'definitiva';
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
  ],
  templateUrl: './programas-liderazgo.component.html',
  styleUrl: './programas-liderazgo.component.scss',
})
export class ProgramasLiderazgoComponent implements OnInit {
  Service = inject(LiderazgoService);
  readonly dialog = inject(MatDialog);

  periodos = signal<Periodo[] | null>(null);

  programas = signal<Programa[] | null>(null);

  alumnos = signal([]);

  protected miFormulario = new FormGroup({
    idPeriodo: new FormControl(102),
    idPrograma: new FormControl(1),
  });

  readonly headersTable: HeaderTable[] = [
    {
      label: 'IDIEST',
      namePropiedad: 'idAlumno',
    },
    {
      label: 'NOMBRE',
      namePropiedad: 'Nombre',
    },
    {
      label: 'CARRERA',
      namePropiedad: 'abrCarrera',
    },
    {
      label: 'GENERACIÓN',
      namePropiedad: 'generacion',
    },
    {
      label: 'CORREO',
      namePropiedad: 'correo',
    },

    {
      label: 'FECHA ALTA',
      namePropiedad: 'fechaAlta',
    },
    {
      label: 'PAGO',
      namePropiedad: 'statusPago',
    },
  ];

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
          periodos.sort((a: any, b: any) => a.anio - b.anio),
        ),
      )
      .subscribe({
        next: (periodos: any) => {
          console.log(periodos);
          this.periodos.set(periodos);
          // this.periodosForm.patchValue(periodos);
        },
        // console.log(periodos),
      });
  }
  private consultarAlumnos() {
    // console.log(this.miFormulario.value);
    const { idPeriodo, idPrograma } = this.miFormulario.value;

    this.Service.getListadoAlumnos({ idPrograma, idPeriodo })
      .pipe(
        take(1),
        //Eliminar espacios en blancos
        map((data) => {
          return data.map((alumno: any) => {
            Object.keys(alumno).forEach((clave) => {
              if (!alumno[clave]) {
                alumno[clave] = null;
              } else {
                return;
              }
            });
            return alumno;
          });
        }),
      )
      .subscribe({
        next: (data) => {
          console.log(data);
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
            },
            error: (error: any) => {
              console.error(error);
            },
          });
        break;
      case 'definitiva':
        this.Service.bajaNormal(idRegistro, 'Prueba')
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
    }
  }
}
