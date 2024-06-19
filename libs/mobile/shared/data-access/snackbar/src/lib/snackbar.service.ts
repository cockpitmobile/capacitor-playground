import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly _snackbar = inject(MatSnackBar);

  open(message: string, action = 'Dismiss', duration?: number) {
    this._snackbar.open(message, action, {
      duration,
    });
  }
}
