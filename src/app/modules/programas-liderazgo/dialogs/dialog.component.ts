import { Component, inject, model } from '@angular/core';
import { MaterialModule } from '../../../shared-material-module/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LiderazgoService } from '../services/programa-liderazgo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  templateUrl: 'dialog.html',
  imports: [MaterialModule, ReactiveFormsModule],
  standalone: true,
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly animal = model(this.data.animal);
  readonly Service = inject(LiderazgoService);
  readonly fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    idPersonaAlumno: [],
    idAlumnoRegistro: [],
    idPeriodo: [],
    idPrograma: [],
    idGeneracion: [],
  });

  onSave() {
    console.log(this.myForm.value); // Imprime el valor del formulario
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
