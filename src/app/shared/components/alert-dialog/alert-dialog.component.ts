import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'shrd-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  // styleUrl: './../../scss/custom-template-miguel-v2.scss',
})
export class AlertDialogComponent {
  @Input() msj?: string = 'Undefinited';
  @Output() actionYes: EventEmitter<any> = new EventEmitter();
  @Output() actionNo: EventEmitter<any> = new EventEmitter();
}
