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
