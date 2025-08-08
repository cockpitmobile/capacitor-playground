import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppStorageService } from '@cockpit/mobile/storage';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly _router = inject(Router);
  private readonly _storage = inject(AppStorageService);

  public isUserSideMenuVisible = signal(false);
  public readonly isMiles = signal(false);

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

  navigateToLogin() {
    this._router.navigate(['/login']);
  }

  navigateToBadges() {
    this._router.navigate(['user', 'badges']);
  }

  navigateToSettings() {
    this._router.navigate(['user', 'settings']);
  }

  navigateToPets() {
    this._router.navigate(['user', 'pets']);
  }

  navigateToProfile() {
    this._router.navigate(['user', 'profile']);
  }

  navigateToActivityStats() {
    this._router.navigate(['user', 'activity-stats']);
  }

  toggleUserSideMenu() {
    this.isUserSideMenuVisible.update((visible) => !visible);
  }

  logout() {
    // TODO: Need to also clear data loaded in memory
    this._storage.clearData().subscribe();
    this._router.navigate(['/login']);
  }

  getIfDisplayReleaseNotes() {
    // TODO: use storage service
    const shouldShow = localStorage.getItem('show-release-notes');
    if (!shouldShow) {
      // TODO:
      // this.setIfDisplayReleaseNotes('true');
      return true;
    }
    return shouldShow === 'true';
  }

  getIfAutoImportStrava() {
    // TODO: use storage service
    const shouldShow = localStorage.getItem('auto-import-strava');
    if (!shouldShow) {
      // TODO:
      // this.setAutoImportStrava('true');
      return true;
    }
    return shouldShow === 'true';
  }
}
