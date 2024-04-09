import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { ActivitiesApiActions, sortedActivitiesSelector } from '@cockpit/activities-state';
import { TrackingActions } from '@cockpit/tracking-state';

@Component({
  selector: 'cockpit-event-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent {
  activities$ = this._store.select(sortedActivitiesSelector);

  constructor(
    private readonly _store: Store
  ){
    // this.network.setupNetworkListener();
    this._store.dispatch(ActivitiesApiActions.loadActivities());
  }

  start() {
    this._store.dispatch(TrackingActions.startTracking());
  }
}
