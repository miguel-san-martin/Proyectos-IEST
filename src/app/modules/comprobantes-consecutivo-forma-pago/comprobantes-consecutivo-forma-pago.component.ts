import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatOption,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInput } from '@angular/material/input';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { PagoCajaService } from './services/pago-caja.service';
import moment from 'moment';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
    timeInput: 'HH:mm',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    timeInput: 'HH:mm',
    timeOptionLabel: 'HH:mm',
  },
};

@Component({
  selector: 'app-comprobantes-consecutivo-forma-pago',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    MatTimepickerToggle,
    MatTimepickerInput,
    MatTimepicker,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatButton,
    MatCard,
    MatMomentDateModule,
  ],
  providers: [
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Opcional: para español
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comprobantes-consecutivo-forma-pago.component.html',
  styleUrl: './comprobantes-consecutivo-forma-pago.component.scss',
})
export class ComprobantesConsecutivoFormaPagoComponent implements OnInit {
  cajas = signal<any[]>([]);
  comprobantes = signal<any[]>([]);

  private Service = inject(PagoCajaService);

  readonly form = new FormGroup({
    fechaInicial: new FormControl(moment()),
    fechaFinal: new FormControl(moment()),
    horaInicial: new FormControl(moment().set({ hour: 8, minute: 0 })),
    horaFinal: new FormControl(moment().set({ hour: 19, minute: 0 })),
    idCaja: new FormControl(0),
    idComprobante: new FormControl(0),
    resumen: new FormControl(false),
  });

  ngOnInit(): void {
    this.Service.getCajas().subscribe((x) => {
      console.log(x);
      this.cajas.set(x);
    });

    this.Service.Obtiene_Comprobantes().subscribe((x) => {
      console.log(x);
      this.comprobantes.set(x);
    });
  }

  submit() {
    // console.log(this.form.value);
    const payload: any = {
      fechaInicial: moment(this.form.get('fechaInicial')?.value).format(
        'DD/MM/YYYY',
      ),
      fechaFinal: moment(this.form.get('fechaFinal')?.value).format(
        'DD/MM/YYYY',
      ),
      horaInicial: moment(this.form.get('horaInicial')?.value).format('HH:mm'),
      horaFinal: moment(this.form.get('horaFinal')?.value).format('HH:mm'),
      idComprobante: this.form.value.idComprobante,
      idCaja: this.form.value.idCaja,
      resumen: Number(this.form.value.resumen),
    };

    console.log(payload);

    this.Service.ObtenerReporte(payload).subscribe((x) => {
      console.log(x);
      window.open(x.liga);
    });
  }
}
