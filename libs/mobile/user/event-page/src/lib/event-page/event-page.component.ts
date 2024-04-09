import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import {
  ActivitiesApiActions,
  sortedActivitiesSelector,
} from '@cockpit/activities-state';
import { TrackingActions } from '@cockpit/tracking-state';
import {
  networkIsConnectedSelector,
  networkIsSyncingSelector,
} from '@cockpit/network-state';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { selfieRequested } from '@cockpit/selfies-state';

@Component({
  selector: 'cockpit-event-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinner],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent {
  activities$ = this._store.select(sortedActivitiesSelector);
  isConnected$ = this._store.select(networkIsConnectedSelector);
  isSyncing$ = this._store.select(networkIsSyncingSelector);

  constructor(private readonly _store: Store) {
    this._store.dispatch(ActivitiesApiActions.loadActivities());
  }

  start() {
    this._store.dispatch(TrackingActions.startTracking());
  }

  requestPhoto() {
    this._store.dispatch(selfieRequested({ title: '' }));
  }
}
