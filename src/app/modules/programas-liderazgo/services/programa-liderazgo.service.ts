import { Injectable } from '@angular/core';
import { ServicioBase } from './servicio-base.service';
import { Observable } from 'rxjs';

interface alumnosRequest {
  idPeriodo?: number | null;
  idPrograma?: number | null;
  idGeneracion?: number | null;
  idEstatus?: number | null;
  pagado?: number | null;
}

interface altaAlumnosRequest {
  idPersonAlumno: number;
  idAlumnoRegistro: number;
  idGeneracion: number;
  fechaVencimiento?: string;
  becaFleishman?: boolean;
}

interface bajaConMotivo {
  idRegistro: number;
  motivoBaja?: string;
}

interface actualizarGeneracion {
  idRegistro: number;
  idGeneracion: number;
}

export interface Permiso {
  error: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class LiderazgoService extends ServicioBase {
  constructor() {
    super();
  }

  controlAcceso(): Observable<Permiso[]> {
    const parametros = {
      servicio: 'vertice',
      accion: 'USR_PermisoConsultaAngular',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, '/api/escolares/escolares.php');
  }

  // CATALOGOS

  getIdProgramas(): Observable<any> {
    const parametros = {
      servicio: 'vertice',
      accion: 'listadoProgramas',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, '/api/escolares/escolares.php');
  }

  getPeriodos(): Observable<any> {
    const parametros = {
      accion: 'consultaPeriodos',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, '/api/escolares/escolares.php');
  }

  getPagos(): Observable<any> {
    const parametros = {
      accion: 'consultaPagos',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, '/api/escolares/escolares.php');
  }

  getEstatus(): Observable<any> {
    const parametros = {
      accion: 'consultaEstatus',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, '/api/escolares/escolares.php');
  }

  getGeneracion(): Observable<any> {
    const parametros = {
      accion: 'consultaGeneracion',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, '/api/escolares/escolares.php');
  }

  //  OBTENER ALUMNOS

  getListadoAlumnos(data: alumnosRequest): Observable<any> {
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

  //   ALTAS

  altaAlumno(data: alumnosRequest & altaAlumnosRequest): Observable<any> {
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

  setGeneracion(data: actualizarGeneracion): Observable<any> {
    const parametros = {
      servicio: 'vertice',
      accion: 'VER_RegistroAlumnosAceptados_ActualizaGeneracion',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...data },
      '/api/escolares/escolares.php',
    );
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

  //  BAJAS

  bajaTemporal(baja: bajaConMotivo): Observable<any> {
    const parametros = {
      accion: 'registroAlumnosBajasTemporal',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...baja },
      '/api/escolares/escolares.php',
    );
  }

  bajaDefinitiva(baja: bajaConMotivo): Observable<any> {
    const parametros = {
      accion: 'registroAlumnosBajasDefinitiva',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...baja },
      '/api/escolares/escolares.php',
    );
  }

  terminoDelPrograma(baja: bajaConMotivo): Observable<any> {
    const parametros = {
      accion: 'registroAlumnosTerminodelPrograma',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, baja },
      '/api/escolares/escolares.php',
    );
  }

  eliminarRegistro(baja: bajaConMotivo): Observable<any> {
    const parametros = {
      accion: 'eliminarRegistro',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...baja },
      '/api/escolares/escolares.php',
    );
  }

  deshacerTemporal(baja: bajaConMotivo): Observable<any> {
    const parametros = {
      accion: 'registroAlumnosRevivirBajaTemporal',
      servicio: 'vertice',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, ...baja },
      '/api/escolares/escolares.php',
    );
  }
}
