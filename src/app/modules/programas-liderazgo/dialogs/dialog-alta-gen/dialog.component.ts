import { Component, inject, model, signal, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LiderazgoService } from '../../services/programa-liderazgo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ShrdAutocompleteComponent } from '@shared/components/shrd-autocomplete/shrd-autocomplete.component';
import {
  Generaciones,
  Periodo,
  Programa,
} from '../../interfaces/Periodo.interface';

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
export class GenDialogComponent {
  @ViewChild('autocomplete') autocomplete:
    | ShrdAutocompleteComponent
    | undefined;

  readonly dialogRef = inject(MatDialogRef<GenDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly Service = inject(LiderazgoService);
  readonly fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    idGeneracion: [],
  });

  beca = model();
  errorMensaje = signal<string>('');

  onSave() {
    console.log(this.myForm.value); // Imprime el valor del formulario
  }

  onNoClick(value: any = undefined): void {
    this.dialogRef.close(value);
  }
}
