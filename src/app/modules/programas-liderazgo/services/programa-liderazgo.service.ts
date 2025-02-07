import { Injectable } from '@angular/core';
import { ServicioBase } from './servicio-base.service';
import { Observable } from 'rxjs';

interface alumnosRequest {
  idPeriodo: number | null | undefined;
  idPrograma: number | null | undefined;
}

interface altaAlumnosRequest {
  idPersonAlumno: number;
  idAlumnoRegistro: number;
  idGeneracion: number;
}

@Injectable({
  providedIn: 'root',
})
export class LiderazgoService extends ServicioBase {
  constructor() {
    super();
  }

  public getIdProgramas(idRegistroAdmin: string = ''): Observable<any[]> {
    const parametros = {
      servicio: 'vertice',
      accion: 'listadoProgramas',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, idRegistroAdmin },
      '/api/escolares/escolares.php',
    );
  }

  public getListadoAlumnos(data: alumnosRequest): Observable<any> {
    const parametros = {
      servicio: 'vertice',
      accion: 'consultaAlumnos',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...data },
      '/api/escolares/escolares.php',
    );
  }

  public altaAlumno(
    data: alumnosRequest & altaAlumnosRequest,
  ): Observable<any> {
    const parametros = {
      servicio: 'vertice',
      accion: 'registroAlumnosAlta',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...data },
      '/api/escolares/escolares.php',
    );
  }

  public getPeriodos(): Observable<any> {
    const parametros = {
      accion: 'consultaPeriodos',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, '/api/escolares/escolares.php');
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

  public bajaTemporal(idRegistro: number, motivoBaja: string): Observable<any> {
    const parametros = {
      accion: 'registroAlumnosBajasTemporal',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, idRegistro, motivoBaja },
      '/api/escolares/escolares.php',
    );
  }

  public bajaNormal(idRegistro: number, motivoBaja: string): Observable<any> {
    const parametros = {
      accion: 'buscador',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, indicador: motivoBaja },
      '/api/escolares/escolares.php',
    );
  }

  public terminoDelPrograma(busqueda: string): Observable<any> {
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
}
