import { Component, inject, signal, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LiderazgoService } from '../../services/programa-liderazgo.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import {
  senalError,
  ShrdAutocompleteComponent,
} from '@shared/components/shrd-autocomplete/shrd-autocomplete.component';

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
  @ViewChild('autocomplete') autocomplete:
    | ShrdAutocompleteComponent
    | undefined;

  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly Service = inject(LiderazgoService);
  readonly fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    idPersonAlumno: ['', [Validators.required]],
    idAlumnoRegistro: ['', [Validators.required]],
    idPeriodo: [102, [Validators.required]],
    idPrograma: [1, [Validators.required]],
    idGeneracion: [
      7,
      [Validators.required, Validators.min(5), Validators.max(10)],
    ],
    fechaVencimiento: [new Date()],
    becaFleishman: [false],
  });
  error = signal<senalError | null>(null);

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
    console.log($event);
    this.myForm.controls['idPersonAlumno'].setValue($event['idperson']);
    this.myForm.controls['idAlumnoRegistro'].setValue($event['idalumno']);
    // console.log(this.myForm.value);
  }

  darDeAlta() {
    this.validarFormulario();
    const fecha = this.myForm.get('fechaVencimiento')?.value;
    const beca = this.myForm.get('becaFleshman')?.value;
    const offset = fecha.getTimezoneOffset() * 60000; // Diferencia en milisegundos
    const fechaLocalISO = new Date(fecha - offset).toISOString();
    this.myForm.get('fechaVencimiento')?.setValue(fechaLocalISO);
    this.myForm.get('becaFleishman')?.setValue(beca ? 1 : 0);

    console.log(this.myForm);
    this.Service.altaAlumno(this.myForm.value).subscribe((data) => {
      console.log(data);
      this.dialogRef.close();
    });
  }

  validarFormulario(): void {
    if (this.myForm.get('idPersonAlumno')?.invalid) {
      this.error.set({ bool: true, mensaje: 'Seleccion no valida' });
    } else {
      this.error.set({ bool: false, mensaje: 'Seleccion no valida' });
    }
  }

  toggleLimit() {
    if (this.myForm.get('fechaVencimiento')?.disabled) {
      this.myForm.get('fechaVencimiento')?.enable();
      this.myForm.get('fechaVencimiento')?.setValue(new Date());
    } else {
      this.myForm.get('fechaVencimiento')?.disable();
      this.myForm.get('fechaVencimiento')?.setValue(undefined);
    }
  }
}

export interface AlumnoBusqueda {
  idalumno: string;
  idperson: string;
  carrera: string;
  login: string;
  nombre: string;
}
