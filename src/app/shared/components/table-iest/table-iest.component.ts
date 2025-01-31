import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  InputSignal,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { HeaderTable, Menu } from '@shared/interfaces/header-tables';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'shared-table-iest',
  standalone: false,
  templateUrl:
    '../../../../../../pagares-reinscripciones/src/app/shared/components/table-iest/table-iest.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .mat-mdc-header-cell {
      background-color: #27272a !important;
    }

    .mat-sort-header-container {
      place-content: center;
      color: white !important;
      font-family: 'Saira', sans-serif;
      font-weight: normal !important;
    }

    .mat-mdc-raised-button > .mat-icon {
      margin-right: 0 !important;
    }

    .isSelectionable {
      cursor: pointer;
    }

    .selectedRow {
      background-color: #bceeff !important;

      &:hover {
        background-color: #55c9ef !important;
      }
    }
  `,
})
export class TableIESTComponent<T> {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly tableHead: InputSignal<HeaderTable[]> =
    input.required<HeaderTable[]>();
  readonly data: InputSignal<T[]> = input.required<T[]>();
  public filtering: InputSignal<string> = input<string>('');

  //! SECCION PARA FUNCIONALIDAD DE SELECT ROW
  readonly selectionableOutpu = output();
  readonly isSelectionable = input<boolean>(false);
  selectingRow = signal(null);

  protected dataSource!: MatTableDataSource<T>;
  readonly effectFilter = effect(() => {
    if (this.dataSource)
      this.dataSource.filter = this.filtering().trim().toLowerCase();
    this.dataSource?.paginator?.firstPage();
  });
  protected effectData = effect(() => {
    this.dataSource = new MatTableDataSource(this.data());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      const map = new Map(
        this.tableHead().map((item: HeaderTable) => [
          item.label,
          item.namePropiedad,
        ]),
      );
      const head: string = map.get(property) || 'error';
      return item[head];
    };
  });

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get displayedColums(): string[] {
    if (!this.tableHead()) return [];
    const headers: string[] = [];
    this.tableHead().forEach((row: HeaderTable) => {
      headers.push(row.label);
    });
    return headers;
  }

  //Este escenario es muy particular, por motivos de ecmascript tengo que hacerlo asi para que me deje de marcar error
  castToArray(element: any) {
    return element as Array<Menu>;
  }

  /**
   * Metodo que emite la casilla seleccionada solo si
   *  isSelectionable() esta declarado
   * @param $event
   */
  emitSelected($event: any) {
    if (this.isSelectionable()) {
      this.selectionableOutpu.emit($event);
      this.selectingRow.set($event);
    }
  }

  slideToggle(event: MatSlideToggleChange, obj: any) {
    obj.fun(event);
  }
}
