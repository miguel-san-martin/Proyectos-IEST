import { Injectable } from '@angular/core';
import { ServicioBase } from '../../../services/servicio-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetalleComprobanteService extends ServicioBase {
  url: string = 'api/contraloria/detallesEmitidosNotas.php';
  constructor() {
    super();
  }

  public getOrdenamiento(): Observable<any> {
    const parametros = {
      servicio: 'catalogos',
      accion: 'ObtieneOrdenamiento',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, this.url);
  }
  public getObtieneOperaciones(): Observable<any> {
    const parametros = {
      servicio: 'catalogos',
      accion: 'ObtieneGrados',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, this.url);
  }

  public getConceptos(): Observable<any> {
    const parametros = {
      servicio: 'catalogos',
      accion: 'ObtieneOperaciones',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, this.url);
  }

  public getInfo(payload: any): Observable<any> {
    const parametros = {
      servicio: 'consultas',
      accion: 'MostrarEnPantalla',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...payload, ...parametros }, this.url);
  }

  public getLiga(payload: any): Observable<any> {
    const parametros = {
      servicio: 'consultas',
      accion: 'ObtenerReporte',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...payload, ...parametros }, this.url);
  }
}
