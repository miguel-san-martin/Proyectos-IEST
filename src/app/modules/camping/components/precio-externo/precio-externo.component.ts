import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import {
  _estatus,
  ResponseEditabilityPeriode,
} from '../../interfaces/responses/response-editability-periode';
import { ResponseGetFee } from '../../interfaces/responses/response-get-fee';
import { VeranoCampamentoComponent } from '../../pages/verano-campamento/verano-campamento.component';
import { CampamentoIestService } from '../../services/campamento-iest.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
    selector: 'form-precio-externo',
    templateUrl: './precio-externo.component.html',
    standalone: false
})
export class PrecioExternoComponent
  extends SnackbarComponent
  implements OnInit, OnChanges
{
  fb = inject(FormBuilder);
  Service = inject(CampamentoIestService);

  @Input() data!: ResponseGetFee[];
  @Input() priceIsEditable: boolean | null = null;
  // public formGroupExternalCost!: FormGroup<any>;

  private baseSubject: Subject<{ idCosto: string; costo: string }> =
    new Subject<any>();
  formGroupExternalCost: FormGroup<{
    twoWeeks: FormGroup<{ maternal: FormGroup<any>; childish: FormGroup<any> }>;
    treeWeeks: FormGroup<{
      maternal: FormGroup<{
        idCost: FormControl<string>;
        description: FormControl<string>;
        price: FormControl<number>;
      }>;
      childish: FormGroup<any>;
    }>;
  }>;

  constructor(private veranos: VeranoCampamentoComponent) {
    super();

    this.formGroupExternalCost = this.fb.group({
      twoWeeks: this.fb.group({
        maternal: this.templateForm(),
        childish: this.templateForm(),
      }),
      treeWeeks: this.fb.group({
        maternal: this.templateForm(),
        childish: this.templateForm(),
      }),
    });
  }

  private templateForm(data: ResponseGetFee | null = null): FormGroup {
    return this.fb.group({
      idCost: [null, Validators.required],
      description: [null, Validators.required],
      price: [
        { value: null, disabled: !this.priceIsEditable },
        Validators.required,
      ],
    });
  }

  // Abre servicio para el debounce time del input
  ngOnInit(): void {
    // this.baseSubject.pipe(debounceTime(500)).subscribe(({ idCosto, costo }) => {
    //   //? Check si el servicio esta abierto
    //   this.Service.CheckIfIsEditable(
    //     this.Service.thePeriodIsClosed?.idPeriodo,
    //   ).subscribe((response: ResponseEditabilityPeriode[]) => {
    //     //? si esta abierto actualizalo
    //     if (response[0].estatus !== _estatus.Cerrado) {
    //       this.Service.updateCost(idCosto, costo).subscribe((resp: any) => {
    //         console.log(resp);
    //         this.openSnackBar();
    //       });
    //     } else {
    //       console.error('Periodo se encuentra cerrado');
    //       this.errorSnackBar();
    //       this.cerrarPeriodo();
    //     }
    //   });
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.convertArrayToForm(this.data);
  }

  //Convierte el array de data a un formulario.
  convertArrayToForm(data: ResponseGetFee[]) {
    if (!data) return console.error('No hay nada que convertir');

    data.forEach(({ idCosto, descripcion, precio, semana }: ResponseGetFee) => {
      // Convertimos XXX.0000 a XXX.00
      const precioFixed = Number(precio).toFixed(2);

      //Data con la que se llenara el formulario
      const formDataRow = {
        idCost: idCosto,
        description: descripcion,
        price: precioFixed,
      };

      const insert = [];
      let insertType = '';
      if (semana == '2') {
        insertType = 'twoWeeks';
      } else {
        insertType = 'treeWeeks';
      }
      insert.push(insertType);
      if (descripcion === 'Infantil') {
        insert.push('childish');
      } else {
        insert.push('maternal');
      }

      this.formGroupExternalCost.get(insert)?.patchValue(formDataRow);
      this.priceIsEditable
        ? this.formGroupExternalCost.get(insert)?.get('price')?.enable()
        : this.formGroupExternalCost.get(insert)?.get('price')?.disable();
    });
    if (!this.formIsCorrect()) {
      console.log('Cerrando seccion inferior', this.formIsCorrect());
      this.veranos.precioExternoIsCorrect = false;
    } else {
      console.log('Abriendo seccion inferior', this.formIsCorrect());
      this.veranos.precioExternoIsCorrect = true;
    }
  }

  onInputChange(costo: any, idDescount: string) {
    const costoEnviado: string = costo.target.value;
    const datos = { idCosto: idDescount.toString(), costo: costoEnviado };
    //this.baseSubject.next(datos);
    this.sumitData(costoEnviado, idDescount.toString());
    if (!this.formIsCorrect()) {
      console.log('Cerrando seccion inferior', this.formIsCorrect());
      this.veranos.precioExternoIsCorrect = false;
    } else {
      console.log('Abriendo seccion inferior', this.formIsCorrect());
      this.veranos.precioExternoIsCorrect = true;
    }
  }

  sumitData(costo: string, idDescount: string) {
    this.Service.CheckIfIsEditable(
      this.Service.thePeriodIsClosed?.idPeriodo,
    ).subscribe((response: ResponseEditabilityPeriode[]) => {
      if (response[0].estatus !== _estatus.Cerrado) {
        this.Service.updateCost(idDescount, costo).subscribe((resp: any) => {
          console.log(resp);
          this.openSnackBar();
        });
      } else {
        console.error('Periodo se encuentra cerrado');
        this.cerrarPeriodo();
        this.errorSnackBar();
      }
    });
  }

  cerrarPeriodo() {
    this.formGroupExternalCost.disable();
  }

  formIsCorrect() {
    let result = true;
    const muestra = [
      this.formGroupExternalCost.get(['twoWeeks', 'maternal', 'price'])?.value,
      this.formGroupExternalCost.get(['twoWeeks', 'childish', 'price'])?.value,
      this.formGroupExternalCost.get(['treeWeeks', 'maternal', 'price'])?.value,
      this.formGroupExternalCost.get(['treeWeeks', 'childish', 'price'])?.value,
    ];

    muestra.forEach((row) => {
      row = Number(row);
      if (row === 0) {
        result = false;
      }
    });
    return result;
  }
}
