import { Component, inject, OnInit, signal } from '@angular/core';
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
export class REPBuscaIdPersonComponent implements OnInit {
  protected readonly data = signal<Consulta[]>([]);
  protected readonly HEAD = HEAD;
  Service = inject(BuscadorPersonaService);
  fb: any = inject(FormBuilder);
  datePipe = inject(DatePipe);

  protected miFormulario = this.fb.group({
    vApellidoM: '',
    vApellidoP: '',
    vNombre: '',
  });
  banderaNoSeEncontro = signal<boolean>(false);

  ngOnInit(): void {
    // this.Service.consultar({
    //   vNombre: '',
    //   vApellidoP: '',
    //   vApellidoM: '',
    // })
    //   .pipe(
    //     map((array) => {
    //       return array.map((row: Consulta) => {
    //         return {
    //           ...row,
    //           Nombres: `${row.apellidop} ${row.apellidom} ${row.Nombres}`,
    //         };
    //       });
    //     }),
    //   )
    //   .subscribe((data: Consulta[]) => {
    //     console.log(data);
    //     this.data.set(data);
    //   });
  }

  submit() {
    console.log(this.miFormulario);
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
        console.log(data);
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
  { label: 'GRADO', namePropiedad: 'grado' },
  { label: 'Id-IEST', namePropiedad: 'IdPerson' },
  { label: 'NOMBRE DEL ALUMNO', namePropiedad: 'Nombres' },
  { label: 'CARRERA', namePropiedad: 'carrera' },
  { label: 'CORREO', namePropiedad: 'correo' },
  { label: 'NACIMIENTO', namePropiedad: 'fechanac' },
];
