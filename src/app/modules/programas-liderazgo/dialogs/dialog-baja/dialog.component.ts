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
import { DialogComponent, DialogData } from '../dialog-alta/dialog.component';

@Component({
  templateUrl: './dialog.html',
  imports: [MaterialModule, ReactiveFormsModule, SharedModule],
  standalone: true,
})
export class DialogBajaComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly Service = inject(LiderazgoService);
  readonly fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    Motivo: [],
  });

  get Motivo() {
    return this.myForm.get('Motivo') as FormControl;
  }

  onSave() {
    console.log(this.myForm.value); // Imprime el valor del formulario
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  darDeAlta() {
    this.Service.altaAlumno(this.myForm.value).subscribe((data) => {
      console.log(data);
    });
  }

  closeDialog(): void {
    this.dialogRef.close(this.Motivo.value); // Devuelve el texto ingresado al componente padre
  }
}
