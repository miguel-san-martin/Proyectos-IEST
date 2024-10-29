import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss',
})
export class DialogEditComponent {}
