import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProspectosService } from './services/prospectos.service';
import { MaterialModule } from '../../shared-material-module/material.module';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditComponent } from './dialogs/dialog-edit/dialog-edit.component';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Prospecto {
  Nombre?: number;
  IDPERSON?: string;
  abrCarrera?: string;
  beca?: number;
  monto?: number;
  fecha?: Date;
}

@Component({
  selector: 'app-buscador-prospectos',
  standalone: true,
  imports: [
    SharedModule,
    MaterialModule,
    MatButtonToggle,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './buscador-prospectos.component.html',
  styleUrl: './buscador-prospectos.component.scss',
})
export class BuscadorProspectosComponent implements OnInit {
  ProspectosService: ProspectosService = inject(ProspectosService);
  data = signal([]);
  subject = signal<Prospecto>({});
  readonly dialog = inject(MatDialog);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('');
  }

  showCard($event: any) {
    this.ProspectosService.this.subject.set($event);
    console.log(this.subject());
  }

  edit() {
    const dialogRef = this.dialog.open(DialogEditComponent, {
      data: {},
    });
  }
  changeSemester() {}

  protected readonly filter = filter;
}
