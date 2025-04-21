import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioBase {
  /**
   * Inyección de dependencias.
   */
  private httpClient = inject(HttpClient);
  /**
   * URL del endpoint que usará la aplicación para conectarse a la API.
   */
  private static readonly API_URL = '/api/camp/CAMP.php';

  constructor() { }


  protected consulta(
    params: any,
    apiUrl: string = ServicioBase.API_URL
  ): Observable<any> {
    const formData: FormData = new FormData();

    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });

    return this.httpClient
      .post<any>(environment.server + apiUrl, formData)
      .pipe(map((res) => (res.info ? res.info : res)));
  }
  protected consultaDetallada(
    params: any,
    apiUrl: string = ServicioBase.API_URL
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
      }
    );

    return this.httpClient.request(peticion);
  }

}
