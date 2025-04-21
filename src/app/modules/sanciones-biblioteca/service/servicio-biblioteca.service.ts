import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioBase } from '../../solicitud-examenes-finales/service/servicio-base.service';
import { ExamenesFinales_Info } from '../../solicitud-examenes-finales/examenes.interfaces';
import { BIBLIOTECA_consultaDatosAlumno } from '../interfaces/biblioteca.interface';

@Injectable({
  providedIn: 'root',
})
export class ServicioBibliotecaService extends ServicioBase {
  url: string = '/api/biblioteca/incidenciasBiblioteca.php';
  constructor() {
    super();
  }

  buscarAlumno(busqueda: string): Observable<any> {
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

  public consultar(): Observable<ExamenesFinales_Info> {
    const parametros = {
      servicio: 'consultas',
      accion: 'BIB_ConsultaIncidencia',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, this.url);
  }

  public consultarIncidencia(
    idPersonaConsulta: number,
  ): Observable<BIBLIOTECA_consultaDatosAlumno> {
    const parametros = {
      servicio: 'consultas',
      accion: 'BIB_Incidencia_ConsultaDatosAlumno',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros, idPersonaConsulta }, this.url);
  }
  public consultarEstatusAlumno(idPersonaAlumno: number) {
    const parametros = {
      servicio: 'consultas',
      accion: 'BIB_Incidencia_ConsultaDatosAlumno',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros, idPersonaAlumno }, this.url);
  }
}
