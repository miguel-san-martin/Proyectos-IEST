import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fechaMayorActualValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaSeleccionada = new Date(control.value);
    const fechaActual = new Date();

    // Elimina la hora, minutos, segundos y milisegundos para comparar solo las fechas
    fechaSeleccionada.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
      return { fechaMayorActual: true };
    }

    return null;
  };
}
