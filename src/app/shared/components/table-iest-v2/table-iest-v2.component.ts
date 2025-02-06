import {
  Component,
  ContentChild,
  input,
  InputSignal,
  TemplateRef,
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

  @ContentChild(BodyTemplateDirective, { read: TemplateRef }) bodyTemplate: any;
  // @ts-ignore
  expandedElement: PeriodicElement | null;

  get displayedColums(): string[] {
    if (!this.tableHead()) return [];
    const headers: string[] = [];
    this.tableHead().forEach((row: HeaderTable) => {
      headers.push(row.label);
    });
    headers.push('expand');
    // headers.push('delete');
    return headers;
  }

  protected readonly BodyTemplateDirective = BodyTemplateDirective;
}
