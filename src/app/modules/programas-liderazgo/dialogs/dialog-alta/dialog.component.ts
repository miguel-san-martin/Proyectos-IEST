import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LiderazgoService } from '../../services/programa-liderazgo.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedModule } from '@shared/shared.module';

export interface DialogData {
  periodos: any[];
  programas: any[];
}

@Component({
  templateUrl: './dialog.html',
  imports: [MaterialModule, ReactiveFormsModule, SharedModule],
  standalone: true,
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly Service = inject(LiderazgoService);
  readonly fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    idPersonAlumno: [],
    idAlumnoRegistro: [],
    idPeriodo: [],
    idPrograma: [],
    idGeneracion: [],
  });

  get GeneracionesControl() {
    return this.myForm.get('idGeneraciones') as FormControl;
  }

  onSave() {
    console.log(this.myForm.value); // Imprime el valor del formulario
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  autoComplete($event: any): void {
    this.myForm.controls['idPersonAlumno'].setValue($event['idperson']);
    this.myForm.controls['idAlumnoRegistro'].setValue($event['idalumno']);
    console.log(this.myForm.value);
  }

  darDeAlta() {
    this.Service.altaAlumno(this.myForm.value).subscribe((data) => {
      console.log(data);
    });
  }
}

export interface AlumnoBusqueda {
  idalumno: string;
  idperson: string;
  carrera: string;
  login: string;
  nombre: string;
}
