import { HeaderTable } from '@shared/interfaces/header-tables';

export const HEADERS_TABLE: HeaderTable[] = [
  {
    label: 'IDIEST',
    namePropiedad: 'idPerson',
  },
  {
    label: 'NOMBRE',
    namePropiedad: 'Nombre',
    maxSpan: '0px',
  },
  {
    label: 'CARRERA',
    namePropiedad: 'abrCarrera',
  },
  {
    label: 'GEN',
    namePropiedad: 'generacion',
  },
  {
    label: 'CORREO',
    namePropiedad: 'correo',
    maxSpan: '0px',
  },
  {
    label: 'PAGADO',
    namePropiedad: 'statusPago',
  },
];
