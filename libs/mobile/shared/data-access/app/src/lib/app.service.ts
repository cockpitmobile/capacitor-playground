import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly _router = inject(Router);

  public isUserSideMenuVisible = signal(false);

  navigateToCurrentEvent() {
    this._router.navigate(['user', 'current-event']);
  }

  navigateToEvents() {
    this._router.navigate(['user', 'event-list']);
  }

  navigateToTeams() {
    this._router.navigate(['user', 'teams']);
  }

  navigateToExplore() {
    this._router.navigate(['user', 'explore']);
  }

  toggleUserSideMenu() {
    this.isUserSideMenuVisible.update((visible) => !visible);
  }
}
