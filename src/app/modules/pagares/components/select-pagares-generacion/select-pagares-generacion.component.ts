import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnInit,
  output,
  Output,
  OutputEmitterRef,
  signal,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../../../shared-material-module/material.module';
import { Catalogo } from '../../../../interfaces/catalogo';
import { GeneracionesResponse } from '../../../../interfaces/generaciones-response';
import { PagareReinscripcionesService } from '../../services/pagare-reinscripciones.service';
import { SelectedPagareGeneracion } from '../../../../interfaces/selected-pagare-generacion';
import { SnackBarComponent } from '@shared/components/snack-bar/snack-bar.component';
import { SharedModule } from '@shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-select-pagares',
  standalone: true,
  imports: [MaterialModule, SharedModule, AsyncPipe],
  templateUrl: './select-pagares-generacion.component.html',
  styleUrl: '../../../../shared/scss/custom-template-miguel-v2.scss',
})
export class SelectPagaresGeneracionComponent implements OnInit {
  Service = inject(PagareReinscripcionesService);
  SnackBar = inject(MatSnackBar);

  @ViewChild('generacion') seleccionGeneracion!: ElementRef; //View de generación el segundo select oculto.

  @Output()
  public emitSelectedOption: EventEmitter<SelectedPagareGeneracion> =
    new EventEmitter();

  dirty: OutputEmitterRef<any> = output<any>();

  @Output()
  public showPanel: EventEmitter<boolean> = new EventEmitter();
  public map = new Map();
  public listaCatalogos!: Catalogo[]; //Lista de Catalogos
  public listaGeneraciones!: GeneracionesResponse[]; //Lista de Generaciones
  public listaReinscripciones!: any[]; // Listad por generacion
  public listaAmboss: any;

  showGenerationTipe = signal('0');
  public selectedCataloge: SelectedPagareGeneracion = {
    catalog: '0',
    generation: '0',
  };

  ngOnInit(): void {
    this.Service.GetCatalogosOperaciones().subscribe(
      (response: Catalogo[]) => {
        this.listaCatalogos = response;
        this.listaCatalogos.forEach((element) => {
          this.map.set(element.id, element.descripcion);
        });
        // console.log(this.map);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.showSnackBar(error);
      },
    );

    this.Service.GetCatalogosGeneraciones().subscribe(
      (response: GeneracionesResponse[]) => {
        this.listaGeneraciones = response;
      },
    );

    this.Service.GetAlumnosAmbos().subscribe((response) => {
      // console.log(response);
      this.listaAmboss = response;
    });
  }

  /*
  Evento que se activa a seleccionar el primer select
  798 y 708 Mostraran Generaciones
  963 Mostraran tipos (Inscription y Reinscripción)
   */
  public onSelectPagare() {
    if (
      Number(this.selectedCataloge.catalog) === 798 ||
      Number(this.selectedCataloge.catalog) === 708 ||
      Number(this.selectedCataloge.catalog) === 963
    ) {
      this.showGenerationTipe.set(this.selectedCataloge.catalog);
      this.showPanel.emit(false);
      this.selectedCataloge.generation = '-1';
      this.seleccionGeneracion.nativeElement.style.display = 'contents';
    } else {
      this.showGenerationTipe.set('0');
      this.selectedCataloge.generation = '0';
      this.seleccionGeneracion.nativeElement.style.display = 'none';
      this.emitSelectedOption.emit(this.selectedCataloge);
      this.showPanel.emit(true);
    }
  }

  public onSelectGeneration() {
    this.emitSelectedOption.emit(this.selectedCataloge);
    this.showPanel.emit(true);
  }

  /** Muestra snackbar **/
  private showSnackBar(messague: HttpErrorResponse) {
    const config: {
      duration: number;
      data: { message: string; error: boolean };
    } = {
      data: {
        message: 'Error: No hay conexión con el modulo' + messague.message,
        error: true,
      },
      duration: 3000,
    };
    this.SnackBar.openFromComponent(SnackBarComponent, config);
  }

  // Si es un pagare tipo Impulsa - 798 o 708 Vertice se mostrara un select con #genereacion como referencia
  protected readonly Number = Number;
}
