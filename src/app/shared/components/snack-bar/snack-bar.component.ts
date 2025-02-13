import {
  Component,
  computed,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

export interface dataSnackBar {
  duration: number;
  data: { message: string; error: boolean };
}

@Component({
  selector: 'app-snack-bar',
  standalone: false,
  templateUrl: './snack-bar.component.html',
  // styleUrl: "../../scss/custom-template-miguel-v2.scss",
})
export class SnackBarComponent implements OnInit {
  public message: WritableSignal<string> = signal('');
  public error: WritableSignal<boolean> = signal(false);
  public icon = computed(() => {
    return this.error() ? 'warning' : 'check';
  });

  constructor(private _snackBarRef: MatSnackBarRef<SnackBarComponent>) {}

  getStyle() {
    return this.error() ? { color: '#ffeaa1' } : { color: '#a4e37e' };
  }

  ngOnInit(): void {
    if (this._snackBarRef.containerInstance.snackBarConfig.data.error) {
      this.error.set(true);
    }
    this.message.set(
      this._snackBarRef.containerInstance.snackBarConfig.data.message,
    );
  }
}
