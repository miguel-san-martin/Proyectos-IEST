import { Component, inject, model, signal, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LiderazgoService } from '../../services/programa-liderazgo.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import {
  senalError,
  ShrdAutocompleteComponent,
} from '@shared/components/shrd-autocomplete/shrd-autocomplete.component';
import {
  Generaciones,
  Periodo,
  Programa,
} from '../../interfaces/Periodo.interface';
import { fechaMayorActualValidator } from '@shared/validator/fechaNoMayorActualValidator';

export interface DialogData {
  periodos: Periodo[];
  programas: Programa[];
  generaciones: Generaciones[];
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
    idGeneracion: [3, [Validators.required]],
    fechaVencimiento: [
      Date(),
      [Validators.required, fechaMayorActualValidator()],
    ],
    becaFleishman: [false],
  });

  beca = model();
  errorAutocomplete = signal<senalError | null>(null);
  errorMensaje = signal<string>('');

  get becaFleishman() {
    return this.myForm.get('becaFleshman');
  }
  get fechaLimite() {
    return this.myForm.get('fechaVencimiento');
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
  }

  darDeAlta() {
    this.validarFormulario();

    if (this.myForm.invalid) return;

    const payload = {
      ...this.myForm.value,
      fechaVencimiento: this.fechaLimite?.value?.toISOString(),
    };
    this.Service.altaAlumno(payload).subscribe((data) => {
      // console.log(data[0].error);
      if (data[0].error == 1) {
        this.errorMensaje.set('¡ERROR!: ' + data[0].mensaje);
      }
      if (data[0].error == 0) {
        this.dialogRef.close();
      }
    });
  }

  validarFormulario(): void {
    if (this.myForm.get('idPersonAlumno')?.invalid) {
      this.errorAutocomplete.set({
        bool: true,
        mensaje: 'Seleccion no valida',
      });
    } else {
      this.errorAutocomplete.set({
        bool: false,
        mensaje: 'Seleccion no valida',
      });
    }

    if (!this.myForm.value.becaFleishman) {
      this.myForm.get('fechaVencimiento')?.hasError('fechaMayorActual')
        ? this.errorMensaje.set('Error fecha de vencimiento invalida')
        : this.errorMensaje.set('');
    }
  }

  toggleLimit() {
    if (!this.myForm.value.becaFleishman) {
      this.myForm.get('fechaVencimiento')?.enable();
      this.myForm
        .get('fechaVencimiento')
        ?.setValidators([Validators.required, fechaMayorActualValidator()]);
    } else {
      this.myForm.get('fechaVencimiento')?.disable();
      this.myForm.get('fechaVencimiento')?.setValidators(null);
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
