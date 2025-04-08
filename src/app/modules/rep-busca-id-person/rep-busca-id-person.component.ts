import {
  AfterViewInit,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { HeaderTable } from '@shared/interfaces/header-tables';
import {
  buscadorIDIEST,
  BuscadorPersonaService,
  Consulta,
} from './service/buscador-persona.service';
import { map } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TableIESTComponent } from '@shared/components/table-iest/table-iest.component';

@Component({
  selector: 'app-rep-busca-id-person',
  standalone: true,
  imports: [
    MatToolbar,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    SharedModule,
    MatCardTitle,
    MatCardContent,
  ],
  providers: [DatePipe],
  templateUrl: './rep-busca-id-person.component.html',
  styleUrl: './rep-busca-id-person.component.scss',
})
export class REPBuscaIdPersonComponent implements AfterViewInit {
  protected readonly data = signal<Consulta[]>([]);
  protected readonly HEAD = HEAD;
  Service = inject(BuscadorPersonaService);
  fb: any = inject(FormBuilder);
  datePipe = inject(DatePipe);

  public filter: string = '';
  protected filteredSignal = signal('');

  @ViewChild('tabla') tabla!: TableIESTComponent<any>;

  protected miFormulario = this.fb.group({
    vApellidoM: '',
    vApellidoP: '',
    vNombre: '',
  });
  banderaNoSeEncontro = signal<boolean>(false);

  ngAfterViewInit(): void {
    // Verificamos si la tabla está inicializada
    if (this.tabla) {
      // console.log('Tabla cargada:', this.tabla);
    } else {
      console.warn('Tabla no se renderizara hasta que se haga una búsqueda.');
    }
  }

  updateValue(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    this.filter = target.value;

    // Asegúrate de que la tabla esté inicializada antes de acceder a sus métodos
    if (this.tabla) {
      this.tabla.applyFilter(this.filter);
    } else {
      console.warn('La tabla no está lista para filtrar');
    }
  }

  submit() {
    // console.log(this.miFormulario);
    let { vApellidoM, vApellidoP, vNombre }: buscadorIDIEST = {
      ...this.miFormulario.value,
    };
    vApellidoM = vApellidoM.trim();
    vApellidoP = vApellidoP.trim();
    vNombre = vNombre.trim();
    this.Service.consultar({ vNombre, vApellidoM, vApellidoP })
      .pipe(
        map((array) => {
          return array.map((row: Consulta) => {
            return {
              ...row,
              Nombres: `${row.apellidop} ${row.apellidom} ${row.Nombres}`,
            };
          });
        }),
        map((array) => {
          return array.map((row: Consulta) => {
            return {
              ...row,
              fechanac: this.datePipe.transform(row.fechanac, 'dd/MM/yyyy'),
            };
          });
        }),
      )
      .subscribe((data: Consulta[]) => {
        // console.log(data);
        this.data.set(data);
        this.miFormulario.reset({
          vApellidoM: '',
          vApellidoP: '',
          vNombre: '',
        });
        if (data.length > 0) {
          this.banderaNoSeEncontro.set(false);
        } else {
          this.banderaNoSeEncontro.set(true);
        }
      });
  }

  querySend($event: any) {
    // console.log('!!!!');
    this.filter = ($event.target as HTMLInputElement).value;
  }

  stringReturn($event: any) {
    return ($event.target as HTMLInputElement).value;
  }
}

export const DATA = [
  {
    GRADO: 'profesional',
    ID_PERSON: '20540',
    NOMBRE: 'ANDRADE MARTÍNEZ ALBERTO MIGUEL',
    CARRERA: 'Licenciatura en Finanzas y Contaduría Pública (Plan 2020)',
    CORREO: 'alberto.andrade@iest.edu.mx',
    NACIMIENTO: '20/10/2001',
  },
];

export const HEAD: HeaderTable[] = [
  { label: 'Grado', namePropiedad: 'grado' },
  { label: 'Id-iest', namePropiedad: 'IdPerson' },
  { label: 'Nombre del Alumno', namePropiedad: 'Nombres' },
  { label: 'Carrera', namePropiedad: 'carrera' },
  { label: 'Correo', namePropiedad: 'correo' },
  { label: 'Nacimiento', namePropiedad: 'fechanac' },
];
