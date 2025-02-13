export interface Periodo {
  idPeriodo: number;
  Periodo: string;
  IniPeriodo: Date;
  FinPeriodo: Date;
  abr: string;
  Prefijo: string;
  abrPeriodo: string;
  fechaInicio: null;
  fechaFin: null;
  fechaInicioVacaciones: null;
  fechaFinVacaciones: null;
  IniSemanaSanta: Date;
  FinSemanaSanta: Date;
  anio: number;
  semestreSERUA: number;
  admisionAbierto: number;
  periodoactual: number;
}

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

export interface Generaciones {}

export interface AlumnoPrograma {
  idRegistro: number;
  idPerson: number;
  idAlumno: number;
  Nombre: string;
  correo: string;
  abrCarrera: string;
  generacion: string;
  statusPago: string;
  fechaPago: string | null;
  fechaAlta: string | null;
  capturadoPor: string | null;
  semestreEntrada: string;
  semestreInicio: string;
  fechaBaja: null | string;
  bajaPor: string | string;
  fechaTermino: null | string;
  terminadoPor: string;
  fechaBajaTem: null | string;
  bajaTemporalPor: string | null;
  programa: string;
}
