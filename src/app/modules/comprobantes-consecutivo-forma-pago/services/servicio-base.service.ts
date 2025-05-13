import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface params {
  servicio: string;
  accion: string;
  tipoRespuesta: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServicioBase {
  /**
   * Inyección de dependencias.
   */
  private httpClient = inject(HttpClient);
  public nombre: string = 'null';
  /**
   * URL del endpoint que usará la aplicación para conectarse a la API.
   */
  private static readonly API_URL = '/api/contraloria/corteCaja.php';

  constructor() {}

  protected consulta(
    params: any,
    apiUrl: string = ServicioBase.API_URL,
  ): Observable<any> {
    const formData: FormData = new FormData();

    Object.keys(params).forEach((key: string) => {
      formData.append(key, params[key]);
    });

    return this.httpClient
      .post<any>(
        environment.server + apiUrl + `?accion=${params.accion}`,
        formData,
      )
      .pipe(map((res) => (res.info ? res.info : res)));
  }

  protected consultaDetallada(
    params: any,
    apiUrl: string = ServicioBase.API_URL,
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });

    const peticion = new HttpRequest(
      'POST',
      environment.server + apiUrl,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      },
    );

    return this.httpClient.request(peticion);
  }
}
