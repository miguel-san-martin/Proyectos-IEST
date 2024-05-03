import { Component } from '@angular/core';
import { RouterLink,RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared-material-module/material.module';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MaterialModule,SharedModule,RouterLink, RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  constructor(){

  }


  title = 'Contraloría';

}
