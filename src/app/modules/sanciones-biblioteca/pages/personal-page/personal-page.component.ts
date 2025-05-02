import { Component, inject, OnDestroy, signal } from '@angular/core';
import { HeaderTable } from '@shared/interfaces/header-tables';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
} from '@angular/material/card';
import { SharedModule } from '@shared/shared.module';
import { ServicioBibliotecaService } from '../../service/servicio-biblioteca.service';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { NgIf } from '@angular/common';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { AddIncidenciaComponent } from '../../dialgos/add-incidencia/add-incidencia.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-personal-page',
  imports: [
    MatCardSubtitle,
    MatCardContent,
    MatCard,
    SharedModule,
    NgIf,
    MaterialModule,
  ],
  templateUrl: './personal-page.component.html',
  styleUrl: './personal-page.component.scss',
})
export class PersonalPageComponent implements OnDestroy {
  Servicio = inject(ServicioBibliotecaService);

  readonly dialog = inject(MatDialog);

  alumnoConsultado = signal<Alumno>({
    correoIest: '',
    emailAlterno: '',
    foto: '',
    idPerson: 0,
    nombreApellido: '',
    sexo: '',
  });
  carreraAlumnoConsultado = signal<CarreraAlumno[]>([
    {
      carrera: '',
      estatus: '',
      semestre: '',
      idGrado: 0,
    },
  ]);
  incidecias = signal<Incidencias[]>([
    {
      capturadoPor: '',
      fecha: '',
      grado: '',
      idIest: 0,
      idIncidencia: 0,
      motivo: '',
      nombreAlumno: '',
    },
  ]);
  url = signal('');

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  consultarTodo(alumno: number | undefined = undefined): void {
    alumno = alumno ?? this.alumnoConsultado().idPerson;
    this.Servicio.consultarBasica(alumno)
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => {
          const alumnoData = data[0];
          this.alumnoConsultado.set(alumnoData);
          this.url.set('https://sie.iest.edu.mx' + alumnoData.foto);
        }),
        switchMap(() => this.Servicio.consultaCarrera(alumno)),
        tap((dataCarrera: any) => {
          this.carreraAlumnoConsultado.set(dataCarrera);
        }),
        switchMap(() => this.Servicio.getAllIncidencias()),
      )
      .subscribe((dataIncidencias: Incidencias[]) => {
        dataIncidencias = dataIncidencias.filter(
          (row: Incidencias) => row.idIest == this.alumnoConsultado().idPerson,
        );
        console.log(dataIncidencias);
        this.incidecias.set(dataIncidencias);
      });
  }

  public back(key: any): string {
    switch (key) {
      case 'nombreApellido':
        return 'Nombre:';
      case 'idPerson':
        return 'ID IEST:';
      case 'sexo':
        return 'Sexo:';
      case 'correoIest':
        return 'Correo institucional:';
      case 'abrCarrera':
        return 'Carrera:';
      case 'estatus':
        return 'Estatus:';
      case 'semestre':
        return 'Semestre:';
      case 'emailAlterno':
        return 'Correo alterno:';
      default:
        return key;
    }
  }

  protected readonly Object = Object;
  protected readonly HEAD = HEAD;

  openDialog(): void {
    const dialogRef = this.dialog.open(AddIncidenciaComponent, {
      height: '400px',
      width: '600px',
      data: this.alumnoConsultado(),
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.consultarTodo(this.alumnoConsultado().idPerson);
    });
  }
}

export interface Alumno {
  [key: string]: any; // Permite acceso por cualquier string
  correoIest: string;
  emailAlterno: string;
  foto: string;
  idPerson: number;
  nombreApellido: string;
  sexo: string;
}

export interface CarreraAlumno {
  [key: string]: any;
  carrera: string;
  estatus: string;
  idGrado: number;
  semestre: string;
}

export interface Incidencias {
  [key: string]: any;
  capturadoPor: string;
  fecha: string; // Podría usarse 'Date' si se va a parsear, pero string es más común para datos sin procesamiento
  grado: string;
  idIest: number;
  idIncidencia: number;
  motivo: string;
  nombreAlumno: string;
}

export const HEAD: HeaderTable[] = [
  { label: 'Motivo', namePropiedad: 'motivo' },
  { label: 'Fecha', namePropiedad: 'fecha' },
  { label: 'Capturado Por', namePropiedad: 'capturadoPor' },
];
