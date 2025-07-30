import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { AppService } from '@cockpit/mobile-data-access-app';

@Component({
  selector: 'lib-shell-page',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './shell-page.component.html',
  styleUrl: './shell-page.component.scss',
})
export class ShellPageComponent {
  private readonly _eventService = inject(EventService);
  private readonly _appService = inject(AppService);

  public readonly currentEvent = this._eventService.currentEvent;

  navigateToCurrentEvent() {
    this._appService.navigateToCurrentEvent();
  }
}
