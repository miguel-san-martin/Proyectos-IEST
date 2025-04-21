export interface BIBLIOTECA_incidencia {
  idIncidencia: number;
  idIest: number;
  nombreAlumno: string;
  grado: number;
  fecha: any;
  motivo: string;
  capturadoPor: string;
}

export interface BIBLIOTECA_consultaDatosAlumno {
  idPerson: number;
  foto: string;
  nombreApellido: string;
  correoIest: number;
  emailAlterno: string;
}

export interface BIBLIOTECA_consultaDatosAcademicos {
  carrera: string;
  estatus: string;
}
