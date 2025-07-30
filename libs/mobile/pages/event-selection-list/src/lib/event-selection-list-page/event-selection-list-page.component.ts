import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { CardModule } from 'primeng/card';
import { RAAEvent } from '@cockpit/mobile/data-models';
import { ChallengesService } from '@cockpit/mobile-data-access-challenges';

@Component({
  selector: 'lib-event-selection-list-page',
  imports: [CommonModule, CardModule],
  templateUrl: './event-selection-list-page.component.html',
  styleUrl: './event-selection-list-page.component.scss',
})
export class EventSelectionListPageComponent implements OnInit {
  private readonly _eventService = inject(EventService);
  private readonly _challengesService = inject(ChallengesService);

  public readonly events = this._eventService.events;

  ngOnInit() {
    // TODO: Move these somewhere else that makes sense
    this._eventService.getAll().subscribe();
    this._challengesService.getAll().subscribe();
  }

  selectEvent(event: RAAEvent) {
    this._eventService.selectEvent(event);
  }
}
