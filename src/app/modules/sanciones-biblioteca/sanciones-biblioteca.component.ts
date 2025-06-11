import { Component, inject, ViewChild } from '@angular/core';
import { ServicioBibliotecaService } from './service/servicio-biblioteca.service';
import { SharedModule } from '@shared/shared.module';
import { ShrdAutocompleteComponent } from '@shared/components/shrd-autocomplete/shrd-autocomplete.component';
import { Subject } from 'rxjs';
import { PersonalPageComponent } from './pages/personal-page/personal-page.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { AdminComponent } from './pages/admin/admin.component';

@Component({
  selector: 'app-sanciones-biblioteca',
  imports: [
    SharedModule,
    ShrdAutocompleteComponent,
    PersonalPageComponent,
    MatTabGroup,
    MatTab,
    AdminComponent,
  ],
  templateUrl: './sanciones-biblioteca.component.html',
  styleUrl: './sanciones-biblioteca.component.scss',
})
export class SancionesBibliotecaComponent {
  Servicio = inject(ServicioBibliotecaService);
  @ViewChild('PersonalInfo') personalInfo!: PersonalPageComponent;

  private destroy$ = new Subject<void>();

  autoComplete($event: void) {
    const obj: { carrera: string; idalumno: string; idperson: string } =
      $event as unknown as {
        carrera: string;
        idalumno: string;
        idperson: string;
      };
    this.personalInfo.consultarTodo(Number(obj.idperson));
  }

  errorAutocomplete() {
    return undefined;
  }

  public back(key: any): string {
    switch (key) {
      case 'nombreApellido':
        return 'Nombre:';
      case 'idPerson':
        return 'ID IEST:';
      case 'sexo':
        return 'Sexo:';
      case 'correoIest':
        return 'Correo institucional:';
      case 'carrera':
        return 'Carrera:';
      case 'estatus':
        return 'Estado:';
      case 'semestre':
        return 'Semestre:';
      case 'emailAlterno':
        return 'Correo alterno:';
      default:
        return key;
    }
  }

  protected readonly Object = Object;
}
