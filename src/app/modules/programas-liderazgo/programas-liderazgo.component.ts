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

@Component({
  selector: 'app-programas-liderazgo',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, SharedModule, MatButtonToggle],
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
    idPeriodo: new FormControl(101),
    idPrograma: new FormControl(2),
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
        // filter((periodo) => periodo.anio > 2010))
        map((periodos: Periodo[]) =>
          periodos
            .filter((periodo) => periodo.anio > 2010)
            .sort((a, b) => a.anio - b.anio),
        ),
      )
      .subscribe({
        next: (periodos: Periodo[]) => {
          // console.log(periodos);
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
      data: {},
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
