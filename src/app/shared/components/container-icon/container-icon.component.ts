import { Component, input } from '@angular/core';

@Component({
  selector: 'app-container-icon',
  standalone: false,
  templateUrl: './container-icon.component.html',
  styleUrl: './container-icon.component.scss',
})
export class ContainerIconComponent {
  iconName = input('check_box_outline_blank');
  leyenda = input('');
}
