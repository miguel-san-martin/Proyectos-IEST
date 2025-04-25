import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HeaderTable } from '@shared/interfaces/header-tables';
import { ServicioBibliotecaService } from '../../service/servicio-biblioteca.service';
import { Incidencias } from '../personal-page/personal-page.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatInput, MatLabel } from '@angular/material/input';
import { TableIESTComponent } from '@shared/components/table-iest/table-iest.component';
import { MatFormField } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddIncidenciaComponent } from '../../dialgos/add-incidencia/add-incidencia.component';
import { RemoveIncidenciaComponent } from '../../dialgos/remove-incidencia/remove-incidencia.component';

@Component({
  selector: 'app-admin',
  imports: [
    SharedModule,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  @ViewChild('tabla') tabla!: TableIESTComponent<any>;
  readonly dialog = inject(MatDialog);
  public filter: string = '';
  Servicio = inject(ServicioBibliotecaService);
  data = signal<Incidencias[]>([
    {
      capturadoPor: '',
      fecha: '',
      grado: '',
      idIest: 0,
      idIncidencia: 0,
      motivo: '',
      nombreAlumno: '',
    },
  ]);

  ngOnInit(): void {
    this.buscarTodos();
  }

  public buscarTodos() {
    this.Servicio.getAllIncidencias().subscribe((data: Incidencias[]) => {
      const mapa = data.map((row: any) => {
        return {
          ...row,
          button_solicitar: {
            type: false,
            label: 'close',
            appareance: {
              color: '#ffffff',
              bc: '#fd5900',
            },
            fun: () => {
              this.dialog
                .open(RemoveIncidenciaComponent, {
                  height: '40%',
                  width: '600px',
                  data: row,
                })
                .afterClosed()
                .subscribe(() => {
                  this.buscarTodos();
                });
            },
          },
        };
      });
      this.data.set(mapa);
      console.log(this.data());
    });
  }

  borrarIncidencia(idIncidencia: number) {
    this.Servicio.darBajaIncidencia(idIncidencia).subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddIncidenciaComponent, {
      height: '400px',
      width: '600px',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.buscarTodos();
    });
  }

  protected readonly HEAD = HEAD;

  updateValue($event: KeyboardEvent): void {
    const target = $event.target as HTMLInputElement;
    this.filter = target.value;

    // Asegúrate de que la tabla esté inicializada antes de acceder a sus métodos
    if (this.tabla) {
      this.tabla.applyFilter(this.filter);
    } else {
      console.warn('La tabla no está lista para filtrar');
    }
  }
}

export const HEAD: HeaderTable[] = [
  { label: 'ID-IEST', namePropiedad: 'idIest' },
  { label: 'Carrera', namePropiedad: 'grado' },
  { label: 'Nombre', namePropiedad: 'nombreAlumno' },
  { label: 'Motivo', namePropiedad: 'motivo' },
  { label: 'Fecha', namePropiedad: 'fecha' },
  { label: 'Capturado Por', namePropiedad: 'capturadoPor' },
  { label: 'Borrado', namePropiedad: 'button_solicitar', button: [{}] },
];
