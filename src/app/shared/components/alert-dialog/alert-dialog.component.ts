import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'shrd-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  imports: [MatButton, MatButton, MatCard],
})
export class AlertDialogComponent {
  @Input() msj?: string = 'Undefinited';
  @Output() actionYes: EventEmitter<any> = new EventEmitter();
  @Output() actionNo: EventEmitter<any> = new EventEmitter();
}
