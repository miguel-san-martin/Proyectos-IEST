import { Component, computed, signal } from '@angular/core';

@Component({
  templateUrl: './main-page.component.html',
  // styleUrl: '../../../../shared/scss/custom-template-miguel-v2.scss',
})
export class MainPageComponent {
  public state = signal<string>('Mujer');
  public precio = computed(() => (this.state() === 'Hombre' ? 300 : 150));
  changePage() {
    this.state.update((current: string): string =>
      current === 'Mujer' ? 'Hombre' : 'Mujer',
    );
    console.log(this.state());
    /*
    this.state.set('abajo')
*/
  }
}
