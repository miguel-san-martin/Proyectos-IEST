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
import { ObjExcelFileService } from '@shared/services/obj-excel-file.service';
import { forkJoin, take } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';

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
    MatTooltip,
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
  input = signal<any>('');
  data = signal<any>(null);

  private Service = inject(DetalleComprobanteService);
  private ExcelService = inject(ObjExcelFileService);
  // Signal del input del usuario

  readonly form = new FormGroup({
    fechaInicial: new FormControl(moment()),
    fechaFinal: new FormControl(moment()),
    ordenamiento: new FormControl('Nombre'),
    idGrado: new FormControl(0),
    idOperacion: new FormControl(),
  });

  // Opciones filtradas como un signal computado
  opcionesFiltradas = computed(() => {
    const texto = this.input().toLowerCase();
    return this.operaciones().filter((op) =>
      op.Operacion.toLowerCase().includes(texto),
    );
  });

  error = signal<boolean>(false);

  ngOnInit(): void {
    const servicios = [
      this.Service.getOrdenamiento(),
      this.Service.getObtieneOperaciones(),
      this.Service.getConceptos(),
    ];
    forkJoin(servicios)
      .pipe(take(1))
      .subscribe((x) => {
        this.ordenamiento.set(x[0]);
        this.grados.set(x[1]);
        this.operaciones.set(x[2]);
      });
  }

  submit() {
    this.Service.getInfo(this.getPayload())
      .pipe(take(1))
      .subscribe((x: any) => {
        if (x.error > 0) {
          this.error.set(true);
        }
        this.data.set(x);
      });
  }

  private getPayload(): operacionRequest {
    return {
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
  }

  //Este metodo es de mat, envia el value actual y devuelve un string con lo que debera decir el input.
  public displayFn(operacion: Operaciones) {
    if (!operacion) return '';
    return operacion.Operacion;
  }

  setInput(evento: any) {
    this.input.set(evento.target.value);
  }

  getEnlace() {
    this.Service.getLiga(this.getPayload()).subscribe((x: any) => {
      if (x.error == 0) {
        window.open(x.liga);
      } else {
        alert(x.mensaje);
      }
    });
  }

  descargarExcel() {
    const columnasMapeo: { [key: string]: string } = {
      idcaja: 'Caja',
      login: 'Cajero',
      idperson: 'IdIest',
      nombre: 'Nombre',
      abrcarrera: 'Carrera',
      precio: 'Monto',
      folio: 'Folio',
      fecha: 'Fecha',
      notacompleta: 'Observaciones',
    };
    this.ExcelService.exportAsExcelFile(this.data(), 'reportes', columnasMapeo);
  }

  protected readonly TABLE_HEAD = TABLE_HEAD;
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
