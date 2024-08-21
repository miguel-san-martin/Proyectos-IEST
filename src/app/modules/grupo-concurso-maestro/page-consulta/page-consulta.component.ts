import {
  Component,
  effect,
  ElementRef,
  inject,
  model,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { HEADTABLE, HEADTABLEMINI } from './headTable';
import { GrupoconcursoService } from '../services/grupoconcurso.service';
import {
  ResponseCatalogosConcurso,
  ResponsePeriods,
  ResponseQuery,
  ResponseTipos,
} from '../interfaces/grupoConcurso.interface';
import { HeaderTable } from '@shared/interfaces/header-tables';

@Component({
  selector: 'app-page-consulta',
  standalone: false,
  templateUrl: './page-consulta.component.html',
  styleUrl: './page-consulta.component.scss',
})
export class PageConsultaComponent implements OnInit {
  Service = inject(GrupoconcursoService);
  tableh: HeaderTable[] = HEADTABLE;
  tablem: HeaderTable[] = HEADTABLEMINI;
  data: any = [];
  dataEquipos: any = [];
  @ViewChild('teams') team: ElementRef | undefined;
  protected busqueda: WritableSignal<{
    idPeriodo: number;
    idConcurso: number;
    tipo: number;
  }> = model({ idConcurso: 0, idPeriodo: 0, tipo: 0 });
  protected selectedContest: WritableSignal<ResponseCatalogosConcurso[]> =
    signal([{ idConcurso: 0, descripcion: 'NULL' }]);
  protected selectedPeriod: WritableSignal<ResponsePeriods[]> = signal([
    { idPeriodo: 0, Periodo: 'NULL' },
  ]);
  protected selectedType: WritableSignal<ResponseTipos[]> = signal([
    { tipo: 0, descripcion: 'NULL' },
  ]);
  protected selectedTeam = signal(null);

  // constructor() {
  //   effect(() => {
  //     this.busqueda();
  //     console.log('cambio');
  //   });
  // }

  ngOnInit(): void {
    this.obtenerConcursos();
    this.obtenerPeriodos();
    this.obtenerTipos();
    this.getTeams();
  }

  protected getTeams() {
    this.Service.GetListaEquipos({ ...this.busqueda() }).subscribe({
      next: (data: ResponseQuery[]) => {
        this.data = data;
        console.log('Equipos', data);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  protected getMembers(idEquipo: number = 0) {
    this.Service.GetMembers(idEquipo).subscribe({
      next: (data: ResponseQuery[]) => {
        // this.data = data;
        console.log('Miembros', data);
        this.dataEquipos = data;
        // this.selectedType.set(data);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  protected showTeamsTable({ idEquipo }: any) {
    // console.log(idEquipo);
    this.selectedTeam.update((old) =>
      old === null || old != idEquipo ? idEquipo : null,
    );
    // console.log(this.selectedTeam());
    this.getMembers(idEquipo);
  }

  private obtenerConcursos() {
    this.Service.GetCatalogos().subscribe({
      next: (data: ResponseCatalogosConcurso[]) => {
        console.log('Concursos: ', data);
        this.selectedContest.set(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private obtenerPeriodos() {
    this.Service.GetPeriodos().subscribe({
      next: (data: ResponsePeriods[]) => {
        console.log('Periodos', data);
        this.selectedPeriod.set(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Obtiene los tipos entre ellos se encuentran Individual y por equipo
   * @private
   */
  private obtenerTipos() {
    this.Service.GetTypes().subscribe({
      next: (data: ResponseTipos[]) => {
        console.log('Tipos', data);
        this.selectedType.set(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}