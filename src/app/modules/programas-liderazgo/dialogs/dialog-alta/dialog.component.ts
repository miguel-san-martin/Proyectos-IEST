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
    fechaVencimiento: [Date()],
    becaFleishman: [false],
  });
  errorAutocomplete = signal<senalError | null>(null);
  errorMensaje = signal<string>('');

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
    const fecha: Date = this.myForm.get('fechaVencimiento')?.value;
    const beca = this.myForm.get('becaFleshman')?.value;

    this.myForm.get('becaFleishman')?.setValue(beca ? 1 : 0);

    const payload = {
      ...this.myForm.value,
      fechaVencimiento: fecha.toISOString(),
    };

    if (this.myForm.invalid)
      this.errorMensaje.set('¡ERROR!: Revisar informacion');
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
