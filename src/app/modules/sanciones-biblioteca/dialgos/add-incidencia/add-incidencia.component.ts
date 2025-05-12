import { Component, inject, model, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { BodyTemplateDirective } from '@shared/directives/body-template.directive';
import { ShrdAutocompleteComponent } from '@shared/components/shrd-autocomplete/shrd-autocomplete.component';
import { ServicioBibliotecaService } from '../../service/servicio-biblioteca.service';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-add-incidencia',
  imports: [
    MatDialogContent,
    BodyTemplateDirective,
    ShrdAutocompleteComponent,
    MatDialogActions,
    MatButton,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInput,
  ],
  templateUrl: './add-incidencia.component.html',
  styleUrl: './add-incidencia.component.scss',
})
export class AddIncidenciaComponent {
  readonly dialogRef = inject(MatDialogRef<any>);
  readonly data = inject<Alumno | undefined>(MAT_DIALOG_DATA);
  Servicio = inject(ServicioBibliotecaService);
  alumno = signal({ idperson: 0 });
  motivo = model('');

  onNoClick(): void {
    this.dialogRef.close();
  }

  autoComplete($event: any) {
    console.log($event);
    this.alumno.set($event);
  }

  sendIncicencia() {
    console.log(this.alumno().idperson, this.motivo());
    if (this.data?.idPerson) {
      this.Servicio.registrarIncidencia(
        this.data.idPerson,
        this.motivo(),
      ).subscribe();
      this.dialogRef.close();
    } else {
      this.Servicio.registrarIncidencia(
        this.alumno().idperson,
        this.motivo(),
      ).subscribe();
      this.dialogRef.close();
    }
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
