import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivitiesService } from '@cockpit/activities';
import { map } from 'rxjs';
import { NetworkService } from '@cockpit/network';
import { TrackingService } from '@cockpit/tracking';
import { Router } from '@angular/router';

@Component({
  selector: 'cockpit-event-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent {
  activities$ = this.activities.allActivities$.pipe(
    map(activities => activities.sort((a, b) => b.id - a.id))
  );

  constructor(
    private readonly activities: ActivitiesService,
    private readonly network: NetworkService,
    private readonly _tracking: TrackingService,
    private readonly _router: Router
  ){
    this.network.setupNetworkListener();
    this.activities.loadActivities();
  }

  create() {
    // this.activities.createTestActivity({
    //   duration: this.timesPressed,
    //   id: this.timesPressed,
    //   distance: this.timesPressed,
    //   image: ''
    // });
  }

  start() {
    this._tracking.startTracking().then(isStarted => {
      if (isStarted) {
        this._router.navigate(['/track-activity']);
      } else {
        alert('Failed to start tracking');
      }
    })
  }
}
