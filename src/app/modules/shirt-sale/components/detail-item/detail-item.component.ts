import { Component, inject, Inject, input, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { Item } from '../../interfaces/items.interface';
import { CurrencyPipe } from '@angular/common';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { ShirtsSaleService } from '../../services/shirts-sale.service';

@Component({
  selector: 'app-detail-item',
  standalone: true,
  imports: [
    MaterialModule,
    CurrencyPipe,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
  templateUrl: './detail-item.component.html',
  // styleUrl: '../../../../shared/scss/custom-template-miguel-v2.scss',
})
export class DetailItemComponent {
  readonly item = input();
  readonly cantidad = signal(0);
  readonly shirt = inject(ShirtsSaleService);

  // constructor( public dialogRef: MatDialogRef<DetailItemComponent>){
  constructor(@Inject(MAT_DIALOG_DATA) public data: Item) {}

  protected increseQuanty() {
    this.cantidad.update((value) => value + 1);
  }
  protected reduceQuanty() {
    this.cantidad.update((value) => value - 1);
  }

  protected sentToCart() {
    this.shirt.addToCart(this.data, this.cantidad());
  }
}
