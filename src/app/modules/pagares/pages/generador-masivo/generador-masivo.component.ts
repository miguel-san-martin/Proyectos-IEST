import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Alumno } from '../../../../interfaces/Alumno';
import { RequestOperationGen } from '../../../../interfaces/request/request-operation-gen';
import { AlumnoResponse } from '../../../../interfaces/responses/AlumnoResponse';
import { ConsultaFecha } from '../../../../interfaces/responses/consulta-fecha';
import { CostoPromesaResponse } from '../../../../interfaces/responses/costo-promesas.interface';
import { SelectedPagareGeneracion } from '../../../../interfaces/selected-pagare-generacion';
import { ResponseAlumnoService } from '../../../../services/mappingServices/response-alumno.service';
import { PagareReinscripcionesService } from '../../services/pagare-reinscripciones.service';
import { HEADTABLE } from './headTable';
import { ExcelService } from '../../services/excel.service';
import { SelectPagaresGeneracionComponent } from '../../components/select-pagares-generacion/select-pagares-generacion.component';
import { infoBar } from '../../interfaces/infoBar.interface';
import { HeaderTable } from '@shared/interfaces/header-tables';

type status = 'procesando' | 'error' | 'completado';

@Component({
  templateUrl: './generador-masivo.component.html',
  styleUrl: './generador-masivo.scss',
})
export class GeneradorMasivoComponent implements OnDestroy {
  Service: PagareReinscripcionesService = inject(PagareReinscripcionesService);
  Maping: ResponseAlumnoService = inject(ResponseAlumnoService);
  Excel: ExcelService = inject(ExcelService);

  @ViewChild('generacion') seleccionGeneracion!: ElementRef; //View de generación el segundo select oculto.
  @ViewChild('selectPagare') pagare!: SelectPagaresGeneracionComponent; //View de generación el segundo select oculto.

  readonly fechas: ConsultaFecha[] = [];
  public infoBar: infoBar = {
    costo: '',
    promesas: '',
    fechas: this.fechas,
    msj: '',
  };
  public loaderBarProgress: number = 0; // Progreso de la barra.
  public data: Alumno[] = []; // Valores de la tabla.
  public headTable: HeaderTable[] = HEADTABLE; //Variable global.
  public disableGenerateButton: boolean = false;
  public subscriptions: Subscription[] = [];
  public selectedCatalog!: string;

  protected mensajeRetro: WritableSignal<{
    estado: status;
    mensaje: string;
    mostrar: boolean;
  }> = signal({
    mensaje: 'Generando',
    mostrar: false,
    estado: 'error',
  });

  readonly showPanel: WritableSignal<boolean> = signal<boolean>(false);
  showLoader: WritableSignal<boolean> = signal(false);
  generationOnProcess = signal<boolean | null>(false);
  private extra!: RequestOperationGen;

  /**
   *  Actualiza el cuadro recibe el idOperacion y idGeneracion
   *
   * @param {SelectedPagareGeneracion} selected
   * @memberof GeneradorMasivoComponent
   */
  public actualizarInfoBar({
    catalog: idOperacion,
    generation: idGeneracion,
  }: SelectedPagareGeneracion) {
    const extra: RequestOperationGen = {
      idOperacion: idOperacion ?? '',
      idGeneracion: idGeneracion ?? '',
    };
    this.extra = extra;
    this.subscriptions.push(
      this.Service.ConsultarValidacionPromesas(extra).subscribe((response) => {
        this.infoBar.msj = response[0].msj;
        if (response[0].error == 1) {
          this.disableGenerateButton = true;
        } else {
          this.disableGenerateButton = false;
        }
      }),
    );

    //Consulta del Costo de las promesas y número de promesas
    this.subscriptions.push(
      this.Service.ConsultarCostoPromesas(extra).subscribe(
        (response: CostoPromesaResponse[]) => {
          if (response.length > 0) {
            const { costo, promesas } = response[0];
            // console.log(costo);
            this.infoBar.costo = costo;
            this.infoBar.promesas = promesas;
          } else {
            this.restablecerInfoBar();
          }
        },
      ),
    );

    //Consulta de las fechas de las promesas.
    this.subscriptions.push(
      this.Service.ConsultarFechasPromesas(extra).subscribe(
        (response: ConsultaFecha[]) => {
          if (response.length > 0) {
            this.infoBar.fechas = response;
          } else {
            this.restablecerInfoBar();
          }
        },
      ),
    );
  }

  public actualizarTabla({
    catalog: idOperacion,
    generation: idGeneracion,
  }: SelectedPagareGeneracion) {
    this.extra;
    const extra: RequestOperationGen = {
      idOperacion: idOperacion ?? '',
      idGeneracion: idGeneracion ?? '',
    };
    // console.log(extra);
    this.showLoader.set(true);
    this.data = [];
    this.selectedCatalog = extra.idOperacion || '0';

    this.subscriptions.push(
      this.Service.GetAlumnosConsiderados(extra).subscribe(
        (response: AlumnoResponse[]) => {
          this.showPanel.set(true);
          this.data = this.Maping.AlumnoResponseToAlumno(response); //Aqui mapeo la respuesta a la mia
        },
        () => {
          this.showPanel.set(false);
        },
        () => {
          this.showLoader.set(false);
        },
      ),
    );
    this.actualizarInfoBar({ catalog: idOperacion, generation: idGeneracion });
    this.loaderBarProgress = 0;
    this.mensajeRetro.set({
      mensaje: 'Proceso terminado',
      mostrar: false,
      estado: 'completado',
    });
  }

  hiddenPanel(signal: boolean) {
    if (!signal) {
      this.showPanel.set(false);
      this.restablecerInfoBar();
      this.data = [];
    }
  }

  ngOnDestroy(): void {
    let subs: number = 0;
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
      subs++;
    });
    // console.log(subs, 'borrados');
  }

  generateExcel() {
    // console.log(this.selectedCatalog);
    // console.log(this.pagare.map.get(this.selectedCatalog));

    this.Excel.generateExcel(
      this.data,
      `${this.pagare.map.get(this.selectedCatalog)}_${new Date().toISOString()}`,
    );
  }

  generarReporte() {
    this.generationOnProcess.set(true);
    this.mensajeRetro.set({
      mensaje: 'Generando.....',
      mostrar: true,
      estado: 'procesando',
    });
    this.Service.GenerateReports(this.extra).subscribe({
      next: (value: any[]) => {
        const { mensaje }: { mensaje: string; error: string } = { ...value }[0];
        console.log(mensaje);
        this.generationOnProcess.set(false);
        this.mensajeRetro.set({
          mensaje: 'Proceso terminado',
          mostrar: true,
          estado: 'completado',
        });
      },
      error: (err) => {
        console.error(err);
        // console.log('error');
        this.mensajeRetro.set({
          mensaje: 'Ha habido un error',
          mostrar: true,
          estado: 'error',
        });
        this.generationOnProcess.set(true);
      },
    });

    // this.Service.TestAPI(this.extra).subscribe({
    //   next: (value: any[]) => {
    //     this.generationOnProcess.set(false);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.generationOnProcess.set(false);
    //   },
    //   complete: () => this.generationOnProcess.set(false),
    // });
  }

  /**
   *  Limpia la infoBar a un estado por default
   *
   * @memberof GeneradorMasivoComponent
   */
  private restablecerInfoBar() {
    this.infoBar = {
      costo: '',
      promesas: '',
      fechas: [],
      msj: 'Seleccione una generacion',
    };
  }
}
