import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly _router = inject(Router);

  navigateToCurrentEvent() {
    this._router.navigate(['user', 'current-event']);
  }
}
