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
