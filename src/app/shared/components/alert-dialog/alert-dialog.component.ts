import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'shrd-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    standalone: false
})
export class AlertDialogComponent {
  @Input() msj?: string = 'Undefinited';
  @Output() actionYes: EventEmitter<any> = new EventEmitter();
  @Output() actionNo: EventEmitter<any> = new EventEmitter();
}
