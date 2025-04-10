import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPaginador]',
  standalone: true,
})
export class PaginadorDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}
}
