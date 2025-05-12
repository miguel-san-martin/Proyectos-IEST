import {
  Component,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { forkJoin, map, tap } from 'rxjs';
import { PrecioDependienteComponent } from '../../components/precio-dependiente/precio-dependiente.component';
import { PrecioExternoComponent } from '../../components/precio-externo/precio-externo.component';
import { PreciosExtraComponent } from '../../components/precios-extra/precios-extra.component';
import { Cataloge } from '../../interfaces/devnull/catalogo';
import { ResponseEditabilityPeriode } from '../../interfaces/responses/response-editability-periode';
import { ResponseExtraFee } from '../../interfaces/responses/response-extra-fee';
import { ResponseGetFee } from '../../interfaces/responses/response-get-fee';
import { ResponseIdDescont } from '../../interfaces/responses/response-mother-child-price';
import { SelectedCatalog } from '../../interfaces/selected-catalog';
import { CampamentoIestService } from '../../services/campamento-iest.service';
import { SharedModule } from '@shared/shared.module';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  templateUrl: './verano-campamento.component.html',
  imports: [
    SharedModule,
    PreciosExtraComponent,
    PrecioDependienteComponent,
    PrecioExternoComponent,
    MatOption,
    MatSelect,
    MatLabel,
    MatFormField,
    MatButton,
    MatIconModule,
  ],
})
export class VeranoCampamentoComponent implements OnInit {
  Service = inject(CampamentoIestService);
  dialog = inject(MatDialog);

  public formIsVisible: boolean = false;
  public formIsNotGenerated!: ResponseEditabilityPeriode | null;
  public priceIsEditable: boolean = true;

  public externalPriceData!: ResponseGetFee[];
  public childishPriceData!: ResponseIdDescont[];
  public maternalPriceData!: ResponseIdDescont[];
  public extraPriceData!: ResponseExtraFee[];
  public catalogesList!: Cataloge[];
  public selectedCatalog!: string;
  public precioExternoIsCorrect: boolean = false;
  public showDebugButton: boolean = false;

  ngOnInit(): void {
    if (!environment.production) {
      this.showDebugButton = true;
    }
    //Obtenemos los periodos
    this.Service.GetPeriods().subscribe((value: SelectedCatalog[]) => {
      this.catalogesList = value;
    });
  }

  // Metodo disparado tras seleccionar un periodo
  $emitSelectedCatalog(idPeriodo: string) {
    const editableObservable = this.Service.CheckIfIsEditable(idPeriodo);

    editableObservable
      .pipe(
        //? Originalmente el store me llega en array, lo convierto
        map((array) => array[0]),
        tap(console.log),
      )
      .subscribe(
        ({ estatus, existe, msj, idRegistro }: ResponseEditabilityPeriode) => {
          //? INFO: Estatus: No Capturado, Cerrado y PermiteCambios.
          //? Existe: 0 que no se ha generado y 1 que ya esta generado.
          //? Id registro sirve para poder mandar a llamar el endpoint para cerrar el periodo.

          const flags = ['No Capturado', 'PermiteCambios'];
          this.priceIsEditable = flags.includes(estatus);

          this.formIsNotGenerated = {
            estatus,
            existe,
            msj,
            idRegistro,
          };
          this.Service.thePeriodIsClosed = {
            estatus,
            existe,
            idRegistro,
            msj,
            idPeriodo: idPeriodo,
          };

          //? Oculta el formulario si no se ha generado.
          if (existe === '0') this.formIsVisible = false;

          this.getPrecios(idPeriodo);
        },
      );
  }

  getPrecios(idPrecio: string) {
    const observables = [
      this.Service.GetBaseFee(idPrecio),
      this.Service.GetChildishPrices(idPrecio),
      this.Service.GetMaternalPrices(idPrecio),
      this.Service.GetAdditionalCosts(idPrecio),
    ];
    forkJoin(observables).subscribe(
      ([baseFee, childPrices, maternalPrices, additionalCosts]) => {
        this.externalPriceData = baseFee as ResponseGetFee[];
        this.childishPriceData = childPrices as ResponseIdDescont[];
        this.maternalPriceData = maternalPrices as ResponseIdDescont[];
        this.extraPriceData = additionalCosts as ResponseExtraFee[];

        this.formIsVisible = this.formIsNotGenerated?.existe !== '0';
      },
    );
  }

  //? SI: Generar nuevo año
  $generateNewPeriod() {
    this.formIsVisible = false;
    this.Service.GenerateMigrationNewPeriod(this.selectedCatalog).subscribe({
      next: (response: any) => {
        this.formIsVisible = true;
        this.$emitSelectedCatalog(this.selectedCatalog);
        window.location.reload();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  //? NO: Generar periodo volver a cargar la pagina.
  $reloadPage() {
    window.location.reload();
  }

  @ViewChild(PrecioExternoComponent) externo!: PrecioExternoComponent;
  @ViewChild(PreciosExtraComponent) extra!: PreciosExtraComponent;
  @ViewChildren(PrecioDependienteComponent)
  dependientes!: QueryList<PrecioDependienteComponent>;

  $openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
  ): void {
    const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
      data: {},
      width: '40%',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'yes') this.closePeriods();
    });
  }

  //? Funcion llamada para cerrar de los formularios en la vista
  closePeriods() {
    this.externo.cerrarPeriodo();
    this.extra.closePeriode();
    this.dependientes.forEach((child) => child.cerrarPeriodo());
    this.priceIsEditable = false;
    this.getPrecios(this.selectedCatalog);
  }

  externalIsIncorrect() {
    this.extra.closePeriode();
    this.dependientes.forEach((child) => child.cerrarPeriodo());
  }

  externalIsCorrect() {
    this.extra.closePeriode();
    this.dependientes.forEach((child) => child.openPeriodo());
  }

  //! Solo dev, borra el periodo actual y pone Existe en 0
  borrarGeneradoDev() {
    console.log('Borrado periodo', this.selectedCatalog);

    this.Service.deleteGeneration(this.selectedCatalog).subscribe((r) => {
      window.location.reload();
    });
  }
}

//? Pone
@Component({
  templateUrl: 'dialog.html',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    MatIconModule,
  ],
})
export class DialogAnimationsExampleDialog {
  Service = inject(CampamentoIestService);

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}

  closePeriod() {
    const idRegistro = this.Service.thePeriodIsClosed?.idRegistro;
    this.Service.closePeriod(idRegistro).subscribe((respose) => {
      console.warn('El periodo se ha cerrado');
      window.location.reload();
    });

    this.dialogRef.close('yes');
  }
}
