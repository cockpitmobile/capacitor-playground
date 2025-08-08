import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Drawer } from 'primeng/drawer';
import { AppService } from '@cockpit/mobile-data-access-app';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'lib-user-side-menu',
  imports: [CommonModule, Drawer, Button, Divider],
  templateUrl: './user-side-menu.component.html',
  styleUrl: './user-side-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSideMenuComponent {
  private readonly _appService = inject(AppService);

  public isVisible = this._appService.isUserSideMenuVisible;

  public readonly topMenuItems = signal([
    {
      label: 'Profile',
      icon: 'pi pi-user',
      action: () => this.openProfile(),
    },
    {
      label: 'My Events',
      icon: 'pi pi-calendar',
      action: () => this.openMyEvents(),
    },
    {
      label: 'Pets',
      icon: 'pi pi-info-circle',
      action: () => this.openPets(),
    },
    {
      label: 'Badge Progress',
      icon: 'pi pi-trophy',
      action: () => this.openBadgeProgress(),
    },
    {
      label: 'Activity Stats',
      icon: 'pi pi-chart-bar',
      action: () => this.viewActivityStats(),
    },
  ]);

  public readonly bottomMenuItems = signal([
    {
      label: 'Settings & Info',
      icon: 'pi pi-info-circle',
      action: () => this.openSettings(),
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      action: () => this.logout(),
    },
  ]);

  toggleSidebar() {
    this._appService.toggleUserSideMenu();
  }

  setSidebarOpen(open: boolean) {
    this.isVisible.set(open);
  }

  openProfile() {
    this._appService.navigateToProfile();
    this.toggleSidebar();
  }

  openMyEvents() {
    this._appService.navigateToEvents();
    this.toggleSidebar();
  }

  openPets() {
    this._appService.navigateToPets();
    this.toggleSidebar();
  }

  openBadgeProgress() {
    this._appService.navigateToBadges();
    this.toggleSidebar();
  }

  viewActivityStats() {
    this._appService.navigateToActivityStats();
    this.toggleSidebar();
  }

  openSettings() {
    this._appService.navigateToSettings();
    this.toggleSidebar();
  }

  logout() {
    this._appService.logout();
    this.toggleSidebar();
  }
}
