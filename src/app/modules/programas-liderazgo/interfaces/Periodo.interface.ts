export interface Programa {
  idPrograma: number;
  nombre: string;
}

export interface Estatus {
  idEstatus: number;
  Estatus: string;
}

export interface Pago {
  idEstatus: number;
  Estatus: string;
}

export interface Generaciones {
  generacionTexto: '3ra';
  idGeneracion: 3;
}

export interface Periodo {
  abrPeriodo: string;
  actual: number;
  idPeriodo: number;
}
