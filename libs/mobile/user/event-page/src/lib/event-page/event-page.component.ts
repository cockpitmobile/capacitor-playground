import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NetworkService } from '@cockpit/network';
import { TrackingService } from '@cockpit/tracking';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActivitiesApiActions, sortedActivitiesSelector } from '@cockpit/activities-state';

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
    private readonly network: NetworkService,
    private readonly _tracking: TrackingService,
    private readonly _router: Router,
    private readonly _store: Store
  ){
    // this.network.setupNetworkListener();
    this._store.dispatch(ActivitiesApiActions.loadActivities());
  }

  start() {
    this._tracking.startTracking().then(isStarted => {
      if (isStarted) {
        this._router.navigate(['/track-activity']);
      } else {
        alert('Failed to start tracking');
      }
    });
  }
}
