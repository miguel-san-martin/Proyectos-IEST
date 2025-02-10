import {
  Component,
  ContentChild,
  effect,
  input,
  InputSignal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HeaderTable } from '@shared/interfaces/header-tables';
import { BodyTemplateDirective } from '@shared/directives/body-template.directive';
import { MenuTemplateDirectiveDirective } from '@shared/directives/menu-template-directive.directive';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-iest-v2',
  styleUrl: 'table-iest-v2.component.scss',
  templateUrl: 'table-iest-v2.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class TableIestV2Component<T> {
  readonly tableHead: InputSignal<HeaderTable[]> =
    input.required<HeaderTable[]>();
  readonly data: InputSignal<T[]> = input.required<T[]>();
  readonly filtering: InputSignal<string> = input<string>('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ContentChild(BodyTemplateDirective, { read: TemplateRef })
  bodyTemplate: any;
  @ContentChild(MenuTemplateDirectiveDirective, { read: TemplateRef })
  menuTemplate: any;

  // @ts-ignore
  expandedElement: PeriodicElement | null;

  readonly effectFilter = effect(() => {
    if (this.dataSource)
      this.dataSource.filter = this.filtering().trim().toLowerCase();
    this.dataSource?.paginator?.firstPage();
  });

  protected dataSource!: MatTableDataSource<T>;
  readonly effectData = effect(() => {
    console.log('P');
    this.dataSource = new MatTableDataSource(this.data());
    this.applyFilter(this.filtering());
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
    headers.push('expand');
    headers.push('menu');
    return headers;
  }

  getColor(element: any) {
    const { fechaTermino, fechaBaja, fechaBajaTem } = element;
    if (fechaBaja) {
      return { 'border-left': '0.25rem solid #f5174f' };
    } else if (fechaBajaTem) {
      return { 'border-left': '0.25rem solid #84f0fd' };
    } else if (fechaTermino) {
      return { 'border-left': '0.25rem solid #ccc' };
    }
    return { 'border-left': '0.25rem solid #7ff126' };
  }
}
