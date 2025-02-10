import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LiderazgoService } from '../../services/programa-liderazgo.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { DialogComponent } from '../dialog-alta/dialog.component';

@Component({
  templateUrl: './dialog.html',
  imports: [MaterialModule, ReactiveFormsModule, SharedModule],
  standalone: true,
})
export class DialogInfoComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly Service = inject(LiderazgoService);
  readonly fb = inject(FormBuilder);
  mensaje: string = '';

  constructor() {
    this.mensaje = this.data.info[0].mensaje;
  }

  ngOnInit() {
    console.log(this.data.info[0].mensaje);
  }

  closeDialog(): void {
    this.dialogRef.close(); // Devuelve el texto ingresado al componente padre
  }
}
