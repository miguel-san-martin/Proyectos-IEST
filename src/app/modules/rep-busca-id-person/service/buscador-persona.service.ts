import { Injectable } from '@angular/core';
import { ServicioBase } from '../../programas-liderazgo/services/servicio-base.service';
import { Observable } from 'rxjs';

export interface buscadorIDIEST {
  vNombre: string;
  vApellidoP: string;
  vApellidoM: string;
}

export interface info {
  info: Consulta[];
}

export interface Consulta {
  expediente: string;
  grado: string;
  IdPerson: string;
  apellidop: string;
  apellidom: string;
  Nombres: string;
  idmaestro: string;
  alumno: string;
  correo: string;
  fechanac: any;
  carrera: string;
}

@Injectable({
  providedIn: 'root',
})
export class BuscadorPersonaService extends ServicioBase {
  constructor() {
    super();
  }

  public consultar(query: buscadorIDIEST): Observable<Consulta[]> {
    const parametros = {
      servicio: 'consulta',
      accion: 'Per_BuscaIdPerson',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...query },
      '/api/academico/modInformacionPersonal.php',
    );
  }
}
