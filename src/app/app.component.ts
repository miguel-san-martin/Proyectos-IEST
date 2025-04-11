import {
  AfterViewInit,
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared-material-module/material.module';
import { SharedModule } from './shared/shared.module';
import { MatDrawer } from '@angular/material/sidenav';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [MaterialModule, SharedModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  readonly flag!: boolean;

  opened: boolean = true;

  constructor() {}

  ngAfterViewInit(): void {
    // this.drawer.close();
  }

  title = 'IEST';

  protected readonly close = close;
  dev: any = signal(false);

  closemap() {
    this.drawer.toggle();
  }

  ngOnInit(): void {}

  protected readonly environment = environment;
}
