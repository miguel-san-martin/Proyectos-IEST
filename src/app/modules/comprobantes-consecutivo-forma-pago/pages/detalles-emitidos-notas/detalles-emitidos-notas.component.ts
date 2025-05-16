import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import moment from 'moment/moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatOption,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DetalleComprobanteService } from '../../services/detalle-comprobante.service';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { HeaderTable } from '@shared/interfaces/header-tables';
import { SharedModule } from '@shared/shared.module';

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

export interface ordenamiento {
  ordenamiento: string;
}
export interface Grados {
  idGrado: number;
  grado: string;
}
export interface Operaciones {
  idOperacion: number;
  Operacion: string;
}
export interface operacionRequest {
  idGrado: number;
  fechaInicial: string;
  fechaFinal: string;
  ordenamiento: string;
  idOperacion: number;
}
export interface Respuesta {
  iddetalletransaccion: number;
  comprobante: string;
  idcaja: number;
  login: string;
  idperson: number;
  Corte: string;
  expediente: number;
  nombre: string;
  abrcarrera: string;
  Operacion: string;
  precio: string;
  folio: number;
  fecha: Date;
  notacompleta: string;
}

@Component({
  selector: 'app-detalles-emitidos-notas',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatButtonModule,
    MatMomentDateModule,
    MatInputModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatIconModule,
    MatCardModule,
    SharedModule,
  ],
  providers: [
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Opcional: para español
  ],
  templateUrl: './detalles-emitidos-notas.component.html',
  styleUrl: './detalles-emitidos-notas.component.scss',
})
export class DetallesEmitidosNotasComponent implements OnInit {
  ordenamiento = signal<ordenamiento[]>([]);
  grados = signal<Grados[]>([]);
  operaciones = signal<Operaciones[]>([]);

  private Service = inject(DetalleComprobanteService);

  readonly form = new FormGroup({
    fechaInicial: new FormControl(moment()),
    fechaFinal: new FormControl(moment()),
    ordenamiento: new FormControl(''),
    idGrado: new FormControl(0),
    idOperacion: new FormControl(),
  });
  data = signal<Respuesta[]>([]);

  ngOnInit(): void {
    this.Service.getOrdenamiento().subscribe((x: ordenamiento[]) => {
      // console.log(x);
      this.ordenamiento.set(x);
    });
    this.Service.getObtieneOperaciones().subscribe((x: Grados[]) => {
      // console.log(x);
      this.grados.set(x);
    });
    this.Service.getConceptos().subscribe((x: Operaciones[]) => {
      // console.log(x);
      this.operaciones.set(x);
      // this.grados.set(x);
    });
    const paylof: operacionRequest = {
      ordenamiento: 'Nombre',
      idGrado: 2,
      fechaFinal: '01/01/2025',
      fechaInicial: '01/01/2024',
      idOperacion: 475,
    };
    this.Service.getInfo(paylof).subscribe((x: Respuesta[]) => {
      console.log(x);
      this.data.set(x);
    });
  }

  submit() {
    const payload: operacionRequest = {
      idGrado: this.form.value.idGrado || 0,
      idOperacion: this.form.value.idOperacion?.idOperacion,
      fechaInicial: moment(this.form.get('fechaInicial')?.value).format(
        'DD/MM/YYYY',
      ),
      fechaFinal: moment(this.form.get('fechaFinal')?.value).format(
        'DD/MM/YYYY',
      ),
      ordenamiento: this.form.value.ordenamiento || '',
    };
    const paylof: operacionRequest = {
      ordenamiento: 'Nombre',
      idGrado: 2,
      fechaFinal: '01/01/2025',
      fechaInicial: '01/01/2024',
      idOperacion: 475,
    };
    this.Service.getInfo(paylof).subscribe((x: Respuesta[]) => {
      console.log(x);
      this.data.set(x);
    });
  }

  // Signal del input del usuario
  input = signal<any>('');

  //Este metodo es de mat, envia el value actual y devuelve un string con lo que debera decir el input.
  public displayFn(operacion: Operaciones) {
    if (!operacion) return '';
    return operacion.Operacion;
  }

  // Opciones filtradas como un signal computado
  opcionesFiltradas = computed(() => {
    const texto = this.input().toLowerCase();
    return this.operaciones().filter((op) =>
      op.Operacion.toLowerCase().includes(texto),
    );
  });

  setInput(evento: any) {
    this.input.set(evento.target.value);
  }

  // Opcional: para debug
  constructor() {}

  protected readonly HTMLInputElement = HTMLInputElement;
  protected readonly TABLE_HEAD = TABLE_HEAD;

  getEnlace() {
    // const payload: operacionRequest = {
    //   idGrado: this.form.value.idGrado || 0,
    //   idOperacion: this.form.value.idOperacion?.idOperacion,
    //   fechaInicial: moment(this.form.get('fechaInicial')?.value).format(
    //     'DD/MM/YYYY',
    //   ),
    //   fechaFinal: moment(this.form.get('fechaFinal')?.value).format(
    //     'DD/MM/YYYY',
    //   ),
    //   ordenamiento: this.form.value.ordenamiento || '',
    // };
    const paylof: operacionRequest = {
      ordenamiento: 'Nombre',
      idGrado: 2,
      fechaFinal: '01/01/2025',
      fechaInicial: '01/01/2024',
      idOperacion: 475,
    };
    this.Service.getLiga(paylof).subscribe((x: any) => {
      console.log(x);
      if (x.error == 0) {
        window.open(x.liga);
      } else {
        alert(x.mensaje);
      }
    });
  }

  descargarExcel() {}
}
export const TABLE_HEAD: HeaderTable[] = [
  {
    label: 'Caja',
    namePropiedad: 'idcaja',
  },
  {
    label: 'Cajero',
    namePropiedad: 'login',
  },
  {
    label: 'idIest',
    namePropiedad: 'idperson',
  },
  {
    label: 'Nombre',
    namePropiedad: 'nombre',
  },
  {
    label: 'AbrCarrera',
    namePropiedad: 'abrcarrera',
  },
  {
    label: 'Monto',
    namePropiedad: 'precio',
  },
  {
    label: 'Folio',
    namePropiedad: 'folio',
  },
  {
    label: 'Fecha',
    namePropiedad: 'fecha',
  },
  {
    label: 'Nota',
    namePropiedad: 'notacompleta',
  },
];
