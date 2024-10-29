import {
  Component,
  ElementRef,
  input,
  InputSignal,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { ServicioBase } from '../../../services/servicio-base.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-shrd-autocomplete',
  templateUrl: './shrd-autocomplete.component.html',
  styleUrl: './shrd-autocomplete.component.scss',
})
export class ShrdAutocompleteComponent extends ServicioBase {
  private inputSubject = new Subject<string>();
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') auto!: ElementRef<any>;
  filteredOptions = signal<any>('');
  searchControl = new FormControl();
  opcion!: any;
  service: InputSignal<(arg: string) => Observable<string>> =
    input.required<(arg: string) => Observable<any>>();

  keyTitle: InputSignal<string> = input<string>('Nombre');

  outputItem = output();

  constructor() {
    super();
    // Configura el debounce en el Subject
    this.inputSubject
      .pipe(
        debounceTime(500), // Espera 300 ms después de la última entrada
        distinctUntilChanged(), // Evita valores repetidos consecutivos
        switchMap((value) => this.service()(value)),
      )
      .subscribe({
        next: (value: any) => {
          this.filteredOptions.set(value);
        },
        error: (err) => console.error(err),
      });
  }
  // .subscribe((r) => {
  //   console.log(r);
  // this.filteredOptions.set(r);
  // console.log(this.filteredOptions());
  // });
  // this.service()(value)
  //   .subscribe({
  //   next: (r) => this.filteredOptions.set(r),
  //   error: (err) => console.log(err),
  // }); // Llama a la función cuando el debounce se completa
  // });

  searching(value: Event) {
    const input = (value.target as HTMLInputElement).value;
    if (input.length < 4) return console.log('Menor a 3');
    // this.service()(input).subscribe((r) => this.filteredOptions.set(r));
    this.inputSubject.next(input);
  }

  emitir(item: any) {
    console.log(this.searchControl.value);
    this.outputItem.emit();
  }

  displayName(item: any): string {
    return item[`Nombre`] ?? 'N/A'; // Devuelve solo el nombre o una cadena vacía si no hay opción
  }
}
