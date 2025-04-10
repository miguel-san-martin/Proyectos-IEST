import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';

export interface Node {
  name: string;
  img: string;
  sub_nodes?: SubNode[];
  path?: string;
}

export interface SubNode {
  name: string;
  path: string;
  img: string;
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'shrd-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrl: './side-nav.component.scss',
    standalone: false
})
export class SideNavComponent implements OnInit {
  http = inject(HttpClient);
  focus: boolean[] = [];
  modulos!: Node[];

  ngOnInit(): void {
    if (environment.production) {
      this.http
        .get<Node[]>(`${environment.url}assets/index.json`)
        .subscribe((res: Node[]) => {
          this.modulos = res;
        });
    } else {
      this.http.get<Node[]>('/assets/index.json').subscribe((res: Node[]) => {
        this.modulos = res;
      });
    }
  }
}
