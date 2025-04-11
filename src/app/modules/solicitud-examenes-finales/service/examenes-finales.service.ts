import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioBase } from './servicio-base.service';
import {
  ExamenesFinales_Info,
  ExamenesFinales_Materias,
} from '../examenes.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ExamenesFinalesService extends ServicioBase {
  constructor() {
    super();
  }

  public consultar(): Observable<ExamenesFinales_Info> {
    const parametros = {
      servicio: 'consultas',
      accion: 'ESC_Check_ExtraOrdinario_ValidaAcceso',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros },
      '/api/escolares/Examenes_Extraordinarios.php',
    );
  }

  public consultarHistorico(): Observable<ExamenesFinales_Info> {
    const parametros = {
      servicio: 'consultas',
      accion: 'ESC_Check_ExtraOrdinario_Consulta_Historial',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros },
      '/api/escolares/Examenes_Extraordinarios.php',
    );
  }

  public consultarMaterias(): Observable<ExamenesFinales_Materias[]> {
    const parametros = {
      servicio: 'consultas',
      accion: 'ESC_Check_ExtraOrdinario_Consulta_Materias',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros },
      '/api/escolares/Examenes_Extraordinarios.php',
    );
  }

  public validarExtraordinario(idCodigo: number): Observable<any> {
    const parametros = {
      servicio: 'consultas',
      accion: 'ESC_Check_ExtraOrdinario_Consulta_Validaciones',
      tipoRespuesta: 'json',
    };
    return this.consulta(
      { ...parametros, idCodigo: idCodigo },
      '/api/escolares/Examenes_Extraordinarios.php',
    );
  }
}
