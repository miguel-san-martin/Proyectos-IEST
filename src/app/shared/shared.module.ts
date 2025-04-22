import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatoamdhhFormatodmaPipe } from './pipes/formatoamdhh-formatodma.pipe';
import { DineroToCurrencyPipe } from './pipes/DineroToCurrency.pipe';
import { TablaContraloriaComponent } from './components/tabla-contraloria/tabla-contraloria.component';
import { PagoVerdeDirective } from './directives/directives.directive';
import { MaterialModule } from '../shared-material-module/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { TableIESTComponent } from '@shared/components/table-iest/table-iest.component';
import { ShrdSpinnerComponent } from '@shared/components/shrd-spinner/shrd-spinner.component';
import { ToastIestComponent } from '@shared/components/toast-iest/toast-iest.component';
import { NumberToMxnPipe } from '@shared/pipes/number-to-mxn.pipe';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ContainerIconComponent } from '@shared/components/container-icon/container-icon.component';
import { TableIestV2Component } from '@shared/components/table-iest-v2/table-iest-v2.component';
import { BodyTemplateDirective } from '@shared/directives/body-template.directive';
import { PaginadorDirective } from '@shared/components/table-iest/paginador.directive';

@NgModule({
  declarations: [
    DineroToCurrencyPipe,
    NumberToMxnPipe,
    FormatoamdhhFormatodmaPipe,
    PagoVerdeDirective,
    TablaContraloriaComponent,
    AlertDialogComponent,
    SnackBarComponent,
    TableIESTComponent,
    ShrdSpinnerComponent,
    ToastIestComponent,
    ContainerIconComponent,
    TableIestV2Component,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    MatMenuItem,
    MatMenu,
    MatMenuTrigger,
    BodyTemplateDirective,
    PaginadorDirective,
  ],
  exports: [
    NumberToMxnPipe,
    DineroToCurrencyPipe,
    FormatoamdhhFormatodmaPipe,
    FormsModule,
    PagoVerdeDirective,
    PagoVerdeDirective,
    ReactiveFormsModule,
    TablaContraloriaComponent,
    AlertDialogComponent,
    TableIESTComponent,
    ShrdSpinnerComponent,
    ToastIestComponent,
    ContainerIconComponent,
    TableIestV2Component,
    BodyTemplateDirective,
  ],
})
export class SharedModule {}
