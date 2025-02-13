import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { RequestOperationGen } from '../../../../interfaces/request/request-operation-gen';
import { ConsultaFecha } from '../../../../interfaces/responses/consulta-fecha';
import { CostoPromesaResponse } from '../../../../interfaces/responses/costo-promesas.interface';
import { SelectedPagareGeneracion } from '../../../../interfaces/selected-pagare-generacion';
import { PagareReinscripcionesService } from '../../services/pagare-reinscripciones.service';
import { RequestAltaPagare } from 'app/interfaces/request/request-alta-pagare';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '@shared/components/snack-bar/snack-bar.component';
import { map } from 'rxjs';

export interface dati {
  date: any;
}

@Component({
  templateUrl: './configuracion-generacion.component.html',
  // styleUrl: '../../../../shared/scss/custom-template-miguel-v2.scss',
})
export class ConfiguracionGeneracionComponent implements OnInit {
  readonly FB = inject(FormBuilder);
  readonly Service = inject(PagareReinscripcionesService);
  readonly SnackBar = inject(MatSnackBar);

  @ViewChild('montoInput') montoInput!: ElementRef; //View de generación el segundo select oculto.

  readonly formIsVisible = signal<boolean>(false);
  readonly hasMadeARequest = signal<boolean>(false);

  showMontoField: boolean = true;
  sliderValue: number = 1;

  idOperacion!: string | null;
  idGeneracion!: string | null;
  idRegistro: string | undefined;

  protected myForm = this.FB.group({
    monto: [0, Validators.required],
    cantidadPromesas: [1],
    fechasPromesas: this.FB.array([]),
  });

  ngOnInit(): void {
    this.myForm.reset();
    this.addDate();
  }

  protected get getFormControlArray() {
    return this.myForm.get('fechasPromesas') as FormArray;
  }

  //Metodo que se ejecuta cuando detecta un detectSliderChange en la barra
  protected detectSliderChange() {
    while (this.getFormControlArray.length < this.sliderValue) {
      this.addDate();
    }
    while (this.getFormControlArray.length > this.sliderValue) {
      this.getFormControlArray.removeAt(this.sliderValue);
    }
  }

  /** Solicita llamada a back para poner en los "input" **/
  protected loadDataOnForm({
    catalog: idOperacion,
    generation: idGeneracion,
  }: SelectedPagareGeneracion) {
    this.idOperacion = idOperacion;
    this.idGeneracion = idGeneracion;
    this.idRegistro = undefined;

    // Limpiar formulario
    this.myForm.reset();

    // Bandera que se activa cuando el usuario hace su primer consulta
    this.hasMadeARequest.set(true);

    //Info que se mandara para consulta
    const extra: RequestOperationGen = {
      idOperacion: idOperacion ?? '',
      idGeneracion: idGeneracion ?? '',
    };

    // Get
    this.Service.ConsultarCostoPromesas(extra)
      .pipe(map((value: CostoPromesaResponse[]) => value[0]))
      .subscribe(
        {
          next: (response: CostoPromesaResponse) => {
            // console.log(response);
            const { promesas, costo, idOperacion, id } = response;
            this.idOperacion = idOperacion;
            this.sliderValue = Number(promesas);
            this.idRegistro = id;

            this.myForm.patchValue({
              monto: Number(costo),
              cantidadPromesas: Number(promesas),
            });

            if (extra.idOperacion == '572') {
              this.myForm.get('monto')?.patchValue(0);
              this.showMontoField = false;
            } else {
              this.showMontoField = true;
            }
          },
          error: () => {
            this.showSnackBar(true);
          },
        },
        // Si hay algun error
      );

    //Set Fechas
    this.Service.ConsultarFechasPromesas(extra).subscribe(
      (response: ConsultaFecha[]) => {
        const fechasDate: Date[] = [];
        response.forEach(({ FechaVencimiento }) => {
          // console.log(fechasDate.length + 1);
          // console.log(response);

          //Regla de negocio, si el back menda que son 2 deben ser 2
          if (fechasDate.length < this.sliderValue)
            fechasDate.push(new Date(FechaVencimiento));
        });
        this.populateDateInputs(fechasDate);
        // this.formIsVisible.set(true);
      },
    );
  }

  /** Llena los inputs **/
  private populateDateInputs(arrayDates: Date[]) {
    this.getFormControlArray.clear();
    arrayDates.forEach((row: Date) => {
      this.addDate(row);
    });
  }

  /** Añade fechas al Form **/
  private addDate(date: Date | null = null) {
    const grupo = this.FB.group({
      date: [date, Validators.required],
    });
    this.getFormControlArray.push(grupo);
  }

  /** Tomar las fechas y las pone en formato 04-abr-24|04-abr-24|06-abr-24|26-abr-24|27-abr-24|26-abr-24|30-abr-24 **/
  private formatDates(): string {
    // @ts-expect-error Esto es correcto solo hay que confiar
    const formDates: dati[] = this.myForm.get('fechasPromesas').value;
    const numDates = (formDates?.length || 0) - 1;

    if (formDates === undefined) return 'Error';

    let dateResult: string = '';
    formDates.forEach((row: dati, index: number) => {
      dateResult = dateResult + this.Service.formatearFecha(row.date);
      if (index != numDates) dateResult += '|';
    });

    //Extracción del | del final.
    //dateResult = dateResult.slice(0, dateResult.length - 1);
    return dateResult;
  }

  // Metodo que se ejecuta con el on summit
  protected onSave() {
    if (this.idGeneracion === null || this.idOperacion === null)
      return console.error('problema');
    if (this.myForm.invalid) return this.showSnackBar(true);

    this.myForm.patchValue({
      cantidadPromesas: this.sliderValue,
    });

    const monto: string = (this.myForm.get('monto')?.value ?? 0) + '';

    let payload: RequestAltaPagare = {
      idOperacion: this.idOperacion,
      idGeneracion: this.idGeneracion,
      monto: monto,
      cantidadPromesas: this.sliderValue,
      fechasPromesas: this.formatDates(),
    };

    if (this.idRegistro) {
      payload = {
        ...payload,
        idRegistro: this.idRegistro,
      };
    }

    // console.log(`Informacion que se mandara`, payload);
    this.Service.PostAltaPagares(payload).subscribe(() => {
      this.showSnackBar();
    });
  }

  /** Muestra snackbar **/
  private showSnackBar(error: boolean = false) {
    const config: {
      duration: number;
      data: { message: string; error: boolean };
    } = {
      data: {
        message: !error
          ? 'Información guardada con éxito'
          : 'Error: Información no guardada',
        error,
      },
      duration: 1800,
    };
    this.SnackBar.openFromComponent(SnackBarComponent, config);
  }
}
