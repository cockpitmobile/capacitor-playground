import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { combineLatest, interval, map, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { currentTrackingInfoSelector, TrackingActions } from '@cockpit/tracking-state';

@Component({
  selector: 'cockpit-activity-tracking-page',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: './activity-tracking-page.component.html',
  styleUrl: './activity-tracking-page.component.scss',
})
export class ActivityTrackingPageComponent {
  stopTracking$ = new Subject();

  trackedActivity$ = this._store.select(currentTrackingInfoSelector);
  duration$ = combineLatest([
    interval(1000).pipe(
      takeUntil(this.stopTracking$)
    ),
    this.trackedActivity$
  ]).pipe(
    map(([_, activity]) => activity && activity.startTime ? Math.floor((new Date().getTime() - new Date(activity.startTime).getTime()) / 1000) : 0)
  );

  constructor(
    private readonly _store: Store
  ) {}

  stop() {
    this.stopTracking$.next(null);
    this.stopTracking$.complete();
    this._store.dispatch(TrackingActions.stopTracking());
  }
}
