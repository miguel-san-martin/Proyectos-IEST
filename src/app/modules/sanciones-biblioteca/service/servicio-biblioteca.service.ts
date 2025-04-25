import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioBase } from '../../solicitud-examenes-finales/service/servicio-base.service';
import { BIBLIOTECA_consultaDatosAlumno } from '../interfaces/biblioteca.interface';
import { PER_BuscadoresPersonas } from '@shared/models/parametros-api/PER_BuscadoresPersonas.model';

@Injectable({
  providedIn: 'root',
})
export class ServicioBibliotecaService extends ServicioBase {
  url: string = '/api/biblioteca/incidenciasBiblioteca.php';
  constructor() {
    super();
  }

  public buscador(args: string): Observable<any> {
    const extras: PER_BuscadoresPersonas = {
      idPerson: 24812,
      indicador: args,
      idTipo: 4,
    };
    const parametros = {
      servicio: 'buscador',
      accion: 'PER_BuscadoresPersonas',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...extras },
      '/api/Buscador/buscador.php',
    );
  }

  public getAllIncidencias(): Observable<any> {
    const parametros = {
      servicio: 'consultas',
      accion: 'BIB_ConsultaIncidencia',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, this.url);
  }
  public consultaCarrera(
    idPersonAlumno: number,
  ): Observable<BIBLIOTECA_consultaDatosAlumno> {
    const parametros = {
      servicio: 'consultas',
      accion: 'BIB_Incidencia_ConsultaDatosAlumno_Academicos',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros, idPersonAlumno }, this.url);
  }
  public consultarBasica(idPersonAlumno: number) {
    const parametros = {
      servicio: 'consultas',
      accion: 'BIB_Incidencia_ConsultaDatosAlumno',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros, idPersonAlumno }, this.url);
  }

  public registrarIncidencia(idPersonAlumno: number, motivo: string) {
    const parametros = {
      servicio: 'procesos',
      accion: 'BIB_RegistraIncidencia_Alta',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros, idPersonAlumno, motivo }, this.url);
  }
  public darBajaIncidencia(idIncidencia: number) {
    const parametros = {
      servicio: 'procesos',
      accion: 'BIB_RegistraIncidencia_Baja',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros, idIncidencia }, this.url);
  }
}
