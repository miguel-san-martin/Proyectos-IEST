import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioBase } from '../../../services/servicio-base.service';

@Injectable({
  providedIn: 'root',
})
export class PagoCajaService extends ServicioBase {
  url: string = '/api/contraloria/corteCaja.php';
  constructor() {
    super();
  }

  public getCajas(): Observable<any> {
    const parametros = {
      servicio: 'catalogos',
      accion: 'Obtiene_Cajas',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, this.url);
  }

  public Obtiene_Comprobantes(): Observable<any> {
    const parametros = {
      servicio: 'catalogos',
      accion: 'Obtiene_Comprobantes',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...parametros }, this.url);
  }

  public ObtenerReporte(payload: any): Observable<any> {
    const parametros = {
      servicio: 'consultas',
      accion: 'ObtenerReporte',
      tipoRespuesta: 'json',
    };
    return this.consulta({ ...payload, ...parametros }, this.url);
  }
}
