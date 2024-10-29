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

  // public getData(): Observable<any> {
  //   return this.http.get<any[]>(`${this.baseUrl}/prospectos`);
  // }

  // public search(
  //   indicador: string = '', // envia un character numero o nombre
  // ): Observable<any> {
  //   const parametros: any = {
  //     servicio: 'cobro',
  //     accion: 'buscador',
  //     tipoRespuesta: 'json',
  //     indicador: indicador,
  //   };
  //   const formData: FormData = new FormData();
  //
  //   Object.keys(parametros).forEach((key: string) => {
  //     formData.append(key, parametros[key]);
  //   });
  //
  //   const apiUrl = 'api/contraloria/cobroNuevoIngreso.php';
  //
  //   return this.http
  //     .post<any>(
  //       environment.server + apiUrl + `?accion=${parametros.accion}`,
  //       formData,
  //     )
  //     .pipe(map((res) => (res.info ? res.info : res)));
  // }
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
}
