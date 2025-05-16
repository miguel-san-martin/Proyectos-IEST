import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared-material-module/material.module';
import { SharedModule } from './shared/shared.module';
import { MatDrawer } from '@angular/material/sidenav';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [MaterialModule, SharedModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  readonly flag!: boolean;
  titulo = signal('');

  opened: boolean = true;
  // private titulo = inject(Title);

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    const currentTitle = this.titleService.getTitle();
    console.log(this.titleService.getTitle().toString());
    this.titulo.set(currentTitle);
  }

  protected readonly close = close;
  dev: any = signal(false);

  closemap() {
    this.drawer.toggle();
  }

  protected readonly environment = environment;
}
