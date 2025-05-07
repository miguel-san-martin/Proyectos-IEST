import { Component, Input, OnChanges, OnInit, signal } from '@angular/core';
import { FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  _estatus,
  ResponseEditabilityPeriode,
} from '../../interfaces/responses/response-editability-periode';
import { ResponseExtraFee } from '../../interfaces/responses/response-extra-fee';
import { FormBase } from '../form-base';
import { MatFormField } from '@angular/material/select';
import { MatError, MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'form-extra-fee',
  templateUrl: './precios-extra.component.html',
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatError,
    MatCard,
    MatCardTitle,
    MatCardContent,
  ],
})
export class PreciosExtraComponent
  extends FormBase
  implements OnChanges, OnInit
{
  @Input() data!: ResponseExtraFee[];
  @Input() priceIsEditable: boolean | null = null;
  private formulario = signal<any>(this.fb.array([]));

  constructor() {
    super();
    // this.form = this.fb.array([]);
  }

  ngOnInit(): void {
    // console.log(this.data);
    this.formulario.set(
      this.fb.group({
        costos: this.fb.array([]),
      }),
    );
    this.setAdditionalCostToForm(this.data);
  }

  get costos() {
    return this.formulario().get('costos') as FormArray;
  }

  setAdditionalCostToForm(array: ResponseExtraFee[]) {
    array.sort((a: any, b: any) => a.descripcion.localeCompare(b.descripcion));
    // if (!Array.isArray(this.form)) return;
    // const form = this.form;
    array.forEach(({ idcosto, descripcion, precio }: ResponseExtraFee) => {
      const precioFixed = Number(precio).toFixed(2);
      this.costos.push(
        this.fb.group({
          idCost: idcosto,
          description: descripcion,
          price: [
            { value: precioFixed, disabled: !this.priceIsEditable },
            Validators.required,
          ],
        }),
      );
    });
  }

  ngOnChanges(): void {
    this.formulario.set(this.fb.array([]));
    this.setAdditionalCostToForm(this.data);
  }

  onInputChange(costo: any, idCosto: string) {
    this.sumitData(costo.value, idCosto.toString());
  }
  sumitData(costo: string, idCosto: string) {
    this.Service.CheckIfIsEditable(
      this.Service.thePeriodIsClosed?.idPeriodo,
    ).subscribe((response: ResponseEditabilityPeriode[]) => {
      if (response[0].estatus !== _estatus.Cerrado) {
        this.Service.updateCost(idCosto, costo).subscribe((resp: any) => {
          console.log('Periodo abierto', resp);
          this.openSnackBar();
        });
      } else {
        console.error('Periodo se encuentra cerrado');
        this.closePeriode();
        this.errorSnackBar();
      }
    });
  }
}
