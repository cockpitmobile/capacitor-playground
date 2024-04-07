import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TrackingService } from '@cockpit/tracking';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { StorageKey } from '@cockpit/constants';
import { Store } from '@ngrx/store';
import { ActivitiesActions } from '@cockpit/activities-state';

@Component({
  selector: 'cockpit-activity-tracking-page',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: './activity-tracking-page.component.html',
  styleUrl: './activity-tracking-page.component.scss',
})
export class ActivityTrackingPageComponent {
  trackedActivity$ = this._tracking.trackedActivity$;
  duration$ = this.trackedActivity$.pipe(
    map(activity => activity && activity.startTime ? Math.floor((new Date().getTime() - new Date(activity.startTime).getTime()) / 1000) : 0)
  );

  constructor(
    private readonly _tracking: TrackingService,
    private readonly _router: Router,
    private readonly _store: Store
  ) {}

  ngOnInit() {
    const trackedActivity = localStorage.getItem(StorageKey.TRACKED_ACTIVITY);
    if (trackedActivity) {
      this._tracking.setTrackedActivity(JSON.parse(trackedActivity) as any);
    }
  }

  stop() {
    this._tracking.stopTracking().then(activity => {
      this._store.dispatch(ActivitiesActions.addActivity({ activity }));
      this._router.navigate(['/test'])
    });
  }
}
