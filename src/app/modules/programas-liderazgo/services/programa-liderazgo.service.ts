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
      accion: 'consultaAlumnos',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...data },
      '/api/escolares/escolares.php',
    );
  }

  // public getListadoAlumnos(data: any): Observable<any> {
  //   const parametros = {
  //     servicio: 'vertice',
  //     accion: 'Reporte_AlumnosAceptados',
  //     tipoRespuesta: 'json',
  //     idPersonCaptura: 18253,
  //   };
  //   return this.consulta(
  //     { ...parametros, ...data },
  //     '/api/escolares/escolares.php',
  //   );
  // }
  public getPeriodos(): Observable<any> {
    const parametros = {
      accion: 'consultaPeriodos',
      servicio: 'procesoRevalidacion',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, '/api/escolares/escolares.php');
  }
}
