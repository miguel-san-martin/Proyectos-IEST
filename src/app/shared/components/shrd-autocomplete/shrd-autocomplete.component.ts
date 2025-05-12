import {
  Component,
  ContentChild,
  input,
  OnDestroy,
  output,
  OutputEmitterRef,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { ServicioBase } from '../../../services/servicio-base.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { BodyTemplateDirective } from '@shared/directives/body-template.directive';
import { MatOption } from '@angular/material/core';
import {
  MatFormField,
  MatHint,
  MatInput,
  MatSuffix,
} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatIconButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { NgTemplateOutlet } from '@angular/common';

export interface senalError {
  mensaje: string;
  bool: boolean;
}

@Component({
  selector: 'app-shrd-autocomplete',
  templateUrl: './shrd-autocomplete.component.html',
  styleUrl: './shrd-autocomplete.component.scss',
  imports: [
    MatOption,
    MatHint,
    MatIcon,
    MatFormField,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatInput,
    MatAutocomplete,
    MatIconButton,
    MatLabel,
    NgTemplateOutlet,
    MatSuffix,
  ],
  standalone: true,
})
export class ShrdAutocompleteComponent
  extends ServicioBase
  implements OnDestroy
{
  private inputSubject = new Subject<string>();
  @ContentChild(BodyTemplateDirective, { read: TemplateRef }) bodyTemplate: any;
  filteredOptions: WritableSignal<any> = signal<any>('');
  functionDisplayName!: (item: { [key: string]: string }) => string;
  searchControl: FormControl<any> = new FormControl();
  placeholder = input(
    'Encuentra a la persona por su nombre, su cuenta o por su ID-IEST*',
  );

  public error = input<senalError | null>({
    bool: false,
    mensaje: 'El campo es invalido',
  });

  /**
   *  Recibe la llamada de un servicio. propiedad-inyectada.metodo.bind(this.propiedad-inyectada)
   *  SIN EL ().
   *  @example [service] = "ProspectosService.search.bind(this.ProspectosService)"
   */
  service =
    input.required<(arg: string) => Observable<NonNullable<unknown>[]>>();
  /**
   * Recibe el nombre de la propiedad del Observable que retornara la function (STRING).
   * @param {string} keyTitle
   * @default 'Nombre'
   * @example
   */
  keyTitle = input<string>('Nombre');

  /**
   * Devuelve 1 elemento del Array de respuesta.
   * @Returns {unknown}
   */
  outputItem: OutputEmitterRef<void> = output();
  subscription!: Subscription;

  constructor() {
    super();
    this.initDebounce(); // Iniciamos el debounce.

    // Función que muestra la etiqueta, asignada aqui.
    this.functionDisplayName = (item: { [key: string]: string }): string => {
      if (!item) return '';
      return item[this.keyTitle()]; // Devuelve solo el nombre o una cadena vacía si no hay opción
    };
  }

  searching(value: Event) {
    const input = (value.target as HTMLInputElement).value;
    if (input.length < 3) {
      this.filteredOptions.set([]);
      return console.log('Menor a 3');
    } else {
      this.inputSubject.next(input);
    }
  }

  /**
  Funcion de debounce
  @param {number} dueTime - Tiempo en milisegundos.
   **/
  protected initDebounce(dueTime: number = 500) {
    this.subscription = this.inputSubject
      .pipe(
        debounceTime(dueTime), // Espera 300 ms después de la última entrada
        distinctUntilChanged(), // Evita valores repetidos consecutivos
        switchMap((value) => this.service()(value)),
      )
      .subscribe({
        next: (value: NonNullable<unknown>) => {
          console.log(value);
          this.filteredOptions.set(value);
        },
        error: (err) => console.error(err),
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
