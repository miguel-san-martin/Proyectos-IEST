import { Injectable } from '@angular/core';
import { ServicioBase } from '../../../services/servicio-base.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProspectosService extends ServicioBase {
  baseUrl: string = 'http://localhost:8080';
  constructor(private http: HttpClient) {
    super();
  }

  public search(indicador: string): Observable<any> {
    const parametros = {
      servicio: 'cobro',
      accion: 'buscador',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, indicador },
      'api/contraloria/cobroNuevoIngreso.php',
    );
  }

  public getInfo(idIest: string): Observable<any> {
    const parametros = {
      servicio: 'cobro',
      accion: 'consultaInfo',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, idIest },
      'api/contraloria/cobroNuevoIngreso.php',
    );
  }
}
