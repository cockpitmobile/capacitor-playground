import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'lib-event-selection-list-page',
  imports: [CommonModule, CardModule],
  templateUrl: './event-selection-list-page.component.html',
  styleUrl: './event-selection-list-page.component.scss',
})
export class EventSelectionListPageComponent implements OnInit {
  private readonly _eventService = inject(EventService);

  public readonly events = this._eventService.events;

  ngOnInit() {
    this._eventService.getAll().subscribe();
  }
}
