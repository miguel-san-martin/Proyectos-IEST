import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { SharedModule } from '@shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HeaderTable } from '@shared/interfaces/header-tables';
import { query } from '@angular/animations';

export type estado = 'En Curso' | 'Rechazado' | 'Aprobado';

export interface presupuesto {
  description: string;
  id: string;
  state: string;
  mount: number;
  tipo: string;
}

@Component({
  standalone: true,
  imports: [MaterialModule, SharedModule],
  templateUrl: './partidas-presupuestales-main-page.component.html',
  // styleUrl: '../../../../shared/scss/custom-template-miguel-v2.scss',
})
export class PartidasPresupuestalesMainPageComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public filter: string = '';

  readonly headersTable: HeaderTable[] = [
    {
      label: 'id',
      namePropiedad: 'id',
    },
    {
      label: 'Descripción',
      namePropiedad: 'description',
    },
    {
      label: 'Monto',
      namePropiedad: 'mount',
    },
    {
      label: 'Estado',
      namePropiedad: 'state',
    },
    {
      label: 'Acción',
      namePropiedad: 'tipo',
    },
  ];
  readonly rawData: presupuesto[] = [
    {
      id: '00001',
      description: 'Alelasa',
      mount: 1000,
      state: 'En Curso',
      tipo: 'aprubed',
    },
    {
      id: '00002',
      description: 'BoaonA',
      mount: 1000,
      state: 'En Curso',
      tipo: 'aprubed',
    },
    {
      id: '00003',
      description: 'Deasa',
      mount: 1000,
      state: 'En Curso',
      tipo: 'aprubed',
    },
    {
      id: '00004',
      description: 'EFASA',
      mount: 1000,
      state: 'En Curso',
      tipo: 'aprubed',
    },
  ];

  readonly dataSource: MatTableDataSource<presupuesto>;

  constructor() {
    this.dataSource = new MatTableDataSource(this.rawData);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  protected readonly query = query;

  querySend($event: KeyboardEvent) {
    this.filter = ($event.target as HTMLInputElement).value;
  }

  get displayedColums(): string[] {
    const sti: string[] = [];
    this.headersTable.map((row: HeaderTable) => {
      sti.push(row.label);
    });
    return sti;
  }
}
