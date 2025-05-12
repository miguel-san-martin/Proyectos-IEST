import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { ServicioBibliotecaService } from '../../service/servicio-biblioteca.service';
import { MatCardSubtitle } from '@angular/material/card';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-remove-incidencia',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatCardSubtitle,
    JsonPipe,
  ],
  templateUrl: './remove-incidencia.component.html',
  styleUrl: './remove-incidencia.component.scss',
})
export class RemoveIncidenciaComponent {
  Servicio = inject(ServicioBibliotecaService);
  readonly dialogRef = inject(MatDialogRef<any>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  error = signal(false);
  borrarInciendia() {
    console.log(this.data.idIncidencia);
    this.Servicio.darBajaIncidencia(this.data.idIncidencia).subscribe({
      next: (data) => {
        this.error.set(false);
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
        this.error.set(false);
      },
    });

    // this.Servicio.darBajaIncidencia(this.data).subscribe((data: any) => {
    //   console.log(data);
    // });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  idIncidencia: number;
  idIest: number;
  nombreAlumno: string;
  grado: string;
  fecha: Date;
  motivo: string;
  capturadoPor: null;
}
