import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CampamentoIestService } from '../../services/campamento-iest.service';
import { ResponseIdDescont } from '../../interfaces/responses/response-mother-child-price';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import {
  _estatus,
  ResponseEditabilityPeriode,
} from '../../interfaces/responses/response-editability-periode';

@Component({
  selector: 'form-precio-dependiente',
  templateUrl: './precio-dependiente.component.html',
})
export class PrecioDependienteComponent
  extends SnackbarComponent
  implements OnChanges, OnInit
{
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;
  keysMaternal: any;

  fb = inject(FormBuilder);
  Service = inject(CampamentoIestService);

  title = 'undefinited';
  keys!: string[];

  @Input() data!: ResponseIdDescont[];
  @Input() priceIsEditable: boolean | null = null;
  public formGroupDescuento!: FormGroup;

  private descuentoSubject: Subject<{ idDescuento: string; costo: string }> =
    new Subject<any>();

  @Output() executarFuncion = new EventEmitter<void>();

  //Se inizializa el formulario
  constructor() {
    super();
    this.formGroupDescuento = new FormGroup({
      twoWeeks: this.fb.array([]),
      treeWeeks: this.fb.array([]),
    });
  }

  //Si el componente cambia se carga reinicia
  ngOnChanges(changes: SimpleChanges): void {
    this.formGroupDescuento = new FormGroup({
      twoWeeks: this.fb.array([]),
      treeWeeks: this.fb.array([]),
    });
    this.buildForm();
  }

  ngOnInit(): void {
    // this.descuentoSubject
    //   .pipe(debounceTime(500))
    //   .subscribe(({ idDescuento, costo }) => {
    //     this.Service.CheckIfIsEditable(this.Service.thePeriodIsClosed?.idPeriodo).subscribe(
    //       (response: ResponseEditabilityPeriode[] ) => {
    //         if(response[0].estatus !== _estatus.Cerrado) {
    //           this.Service.updateDescount(idDescuento, costo).subscribe((resp: any) => {
    //             console.log(resp);
    //             this.openSnackBar()
    //           });
    //         }
    //         else{
    //           console.error('Periodo se encuentra cerrado');
    //           this.cerrarPeriodo()
    //           this.errorSnackBar()
    //         }
    //       }
    //     )
    //   });
  }

  buildForm() {
    this.initializeFormfromArray(this.data);
  }

  //En teoria ya no se necesita
  eliminarDuplicidad(array: any) {
    // Agrega más propiedades si es necesario
    const conjunto = new Set<string>();

    const objetosUnicos = array.filter((objeto: any) => {
      const clave = `${objeto.id}-${objeto.descripcion}-${objeto.Semana}`; // Creamos una clave única para cada objeto
      if (conjunto.has(clave)) {
        return false; // Si ya existe en el conjunto, lo filtramos
      } else {
        conjunto.add(clave); // Agregamos la clave al conjunto para rastrear el objeto
        return true;
      }
    });
    return objetosUnicos;
  }

  initializeFormfromArray(array: ResponseIdDescont[]) {
    if (!array[0]) return;
    const typo = array[0]?.idtipo;
    this.title = typo == '2' ? 'Precio Infantil' : 'Precio Maternal';

    this.fillGaps(array).forEach((row: ResponseIdDescont) => {
      this.addToControlIdDescount(row);
    });

    //! CUIDADO SI EN EL RESPONSE ME LLEGA ALGO QUE ESTE EN TWOWEEKS Y NO ESTE EN TREE VA A TRONAR
    this.keys = this.formGroupDescuento
      .get('treeWeeks')
      ?.value.map((obj: any) => {
        return obj.description;
      });
  }
  fillGaps(array: ResponseIdDescont[]): ResponseIdDescont[] {
    const uniqueElements: ResponseIdDescont[] = [];
    array.forEach((row: ResponseIdDescont) => {
      const array2 = array.filter(
        (element) => element.descripcion === row.descripcion,
      );

      if (array2.length == 1) {
        uniqueElements.push(array2[0]);
      }
    });
    uniqueElements.forEach((row: ResponseIdDescont) => {
      array.push({
        iddescuento: '0',
        idtipo: row.idtipo,
        Semana: row.Semana === '2' ? '3' : '2',
        descripcion: row.descripcion,
        costo: 'null',
      });
    });
    array.sort((a, b) => b.descripcion.localeCompare(a.descripcion));
    return array;
  }

  addToControlIdDescount({
    iddescuento,
    idtipo,
    descripcion,
    costo,
    Semana,
  }: ResponseIdDescont) {
    const costoFixed = Number(costo).toFixed(2);
    const grupo = this.fb.group({
      idDescount: [iddescuento, Validators.required],
      idType: [idtipo, Validators.required],
      description: [descripcion, Validators.required],
      cost: [
        { value: costoFixed, disabled: !this.priceIsEditable },
        Validators.required,
      ],
    });

    let form: FormArray;

    if (Semana !== '3') {
      form = this.formGroupDescuento.get('twoWeeks') as FormArray;
    } else {
      form = this.formGroupDescuento.get('treeWeeks') as FormArray;
    }
    form.push(grupo);
  }

  onInputChange(costo: any, idDescuento: string) {
    const costoEnviado: string = costo.target.value;
    this.sumitData(costoEnviado, idDescuento);
    // const datos = { idDescuento: idDescuento.toString(), costo: costoEnviado };
    //this.descuentoSubject.next(datos);
  }

  sumitData(costo: string, idDescuento: string) {
    this.Service.CheckIfIsEditable(
      this.Service.thePeriodIsClosed?.idPeriodo,
    ).subscribe((response: ResponseEditabilityPeriode[]) => {
      if (response[0].estatus !== _estatus.Cerrado) {
        this.Service.updateDescount(idDescuento, costo).subscribe(
          (resp: any) => {
            console.log(resp);
            this.openSnackBar();
          },
        );
      } else {
        console.error('Periodo se encuentra cerrado');
        this.cerrarPeriodo();
        this.errorSnackBar();
      }
    });
  }

  cerrarPeriodo() {
    this.formGroupDescuento.disable();
  }
  openPeriodo() {
    this.formGroupDescuento.enable();
  }
}
