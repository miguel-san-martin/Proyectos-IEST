import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import {
  _estatus,
  ResponseEditabilityPeriode,
} from '../../interfaces/responses/response-editability-periode';
import { ResponseExtraFee } from '../../interfaces/responses/response-extra-fee';
import { FormBase } from '../form-base';

@Component({
  selector: 'form-extra-fee',
  templateUrl: './precios-extra.component.html',
  // styleUrl: '../../../../shared/scss/custom-template-miguel-v2.scss'
})
export class PreciosExtraComponent
  extends FormBase
  implements OnChanges, OnInit
{
  //private baseSubject: Subject<{ idcosto: string; costo: string }> = new Subject<any>();

  @Input() data!: ResponseExtraFee[];
  @Input() priceIsEditable: boolean | null = null;

  constructor() {
    super();
    this.form = this.fb.array([]);
    console.log(this.form);
  }

  get getFormControl() {
    if (Array.isArray(this.form)) {
      return this.form as FormArray;
    } else {
      return new FormArray([]);
    }
  }

  setAdditionalCostToForm(array: ResponseExtraFee[]) {
    array.sort((a: any, b: any) => a.descripcion.localeCompare(b.descripcion));

    if (!Array.isArray(this.form)) return;
    const form = this.form;
    array.forEach(({ idcosto, descripcion, precio }: ResponseExtraFee) => {
      const precioFixed = Number(precio).toFixed(2);
      form.push(
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

  ngOnInit(): void {
    // this.baseSubject
    // .pipe(debounceTime(500))
    // .subscribe(({ idcosto, costo }) => {
    //   this.Service.CheckIfIsEditable(this.Service.thePeriodIsClosed?.idPeriodo).subscribe(
    //     (response: ResponseEditabilityPeriode[] ) => {
    //       if(response[0].estatus !== _estatus.Cerrado) {
    //         this.Service.updateCost(idcosto, costo).subscribe((resp: any) => {
    //           console.log(resp);
    //           this.openSnackBar()
    //         });
    //       }
    //       else{
    //         console.error('Periodo se encuentra cerrado');
    //         this.errorSnackBar();
    //         this.cerrarPeriodo();
    //       }
    //     }
    //   )
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.form = this.fb.array([]);
    this.setAdditionalCostToForm(this.data);
  }

  onInputChange(costo: any, idCosto: string) {
    this.sumitData(costo.value, idCosto.toString());
    // const costoEnviado: string = costo.value;
    // const datos = { idcosto: idCosto.toString(), costo: costoEnviado };
    // this.baseSubject.next(datos);
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

  // cerrarPeriodo(){
  //   this.form.disable()
  // }

  // openPeriodo(){
  //   this.form.enable()
  // }
}
