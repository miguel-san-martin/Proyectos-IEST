import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-shrd-spinner',
  standalone: true,
  templateUrl: './shrd-spinner.component.html',
  styleUrl: './shrd-spinner.component.scss',
  imports: [MatProgressSpinner],
})
export class ShrdSpinnerComponent {}
