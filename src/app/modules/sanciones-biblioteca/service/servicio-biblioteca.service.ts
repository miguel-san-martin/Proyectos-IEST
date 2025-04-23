import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioBase } from '../../solicitud-examenes-finales/service/servicio-base.service';
import { BIBLIOTECA_consultaDatosAlumno } from '../interfaces/biblioteca.interface';

@Injectable({
  providedIn: 'root',
})
export class ServicioBibliotecaService extends ServicioBase {
  url: string = '/api/biblioteca/incidenciasBiblioteca.php';
  constructor() {
    super();
  }

  public buscarAlumno(busqueda: string): Observable<any> {
    const parametros = {
      accion: 'buscador',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, indicador: busqueda },
      '/api/escolares/escolares.php',
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
  public darBajaIncidencia(idIncicencia: number) {
    const parametros = {
      servicio: 'procesos',
      accion: 'BIB_RegistraIncidencia_Baja',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros, idIncicencia }, this.url);
  }
}
