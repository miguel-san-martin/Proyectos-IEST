export interface ExamenesFinales_Consulta {
  info: ExamenesFinales_Info[];
}

export interface ExamenesFinales_Info {
  error: number;
  mensaje: string;
  idAlumno: number;
  carrera: null;
  idPlan: number;
  idRama: number;
  idTronco: number;
  nombre: null;
}

export interface ExamenesFinales_Materias {
  idCodigo: number;
  materia: string;
  permite: string;
  solicitada: string;
  pago: string;
  fecha: Date;
  error: string;
  mensaje: null;
  notas: string;
}
