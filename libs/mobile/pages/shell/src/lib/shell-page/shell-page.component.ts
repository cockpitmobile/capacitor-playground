import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { AppService } from '@cockpit/mobile-data-access-app';
import { UserSideMenuComponent } from '@cockpit/user-side-menu';
import { BottomNavIconComponent } from '@cockpit/bottom-nav-icon';
import { Store } from '@ngrx/store';
import { selectUrl } from '@cockpit/mobile/network-state';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-shell-page',
  imports: [
    CommonModule,
    RouterOutlet,
    UserSideMenuComponent,
    BottomNavIconComponent,
  ],
  templateUrl: './shell-page.component.html',
  styleUrl: './shell-page.component.scss',
})
export class ShellPageComponent {
  private readonly _store = inject(Store);
  private readonly _eventService = inject(EventService);
  private readonly _appService = inject(AppService);

  public readonly currentEvent = this._eventService.currentEvent;
  public readonly currentUrl = this._store.selectSignal(selectUrl);

  public readonly isOnExplorePage = computed(() => {
    const url = this.currentUrl();
    return url?.includes('explore') || false;
  });

  public readonly isOnCurrentEventPage = computed(() => {
    const url = this.currentUrl();
    return url?.includes('current-event') || false;
  });

  public readonly isOnTeamsPage = computed(() => {
    const url = this.currentUrl();
    console.log('Current URL:', url);
    return url?.includes('teams') || false;
  });

  navigateToCurrentEvent() {
    this._appService.navigateToCurrentEvent();
  }

  navigateToTeams() {
    this._appService.navigateToTeams();
  }

  toggleSideBar() {
    this._appService.toggleUserSideMenu();
  }
}
