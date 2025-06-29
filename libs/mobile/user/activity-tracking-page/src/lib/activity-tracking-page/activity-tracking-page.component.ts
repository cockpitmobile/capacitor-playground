import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  combineLatest,
  interval,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { Store } from '@ngrx/store';
import {
  currentTrackingInfoSelector,
  TrackingActions,
} from '@cockpit/mobile/tracking-state';
import {
  GeoJSONSourceComponent,
  LayerComponent,
  MapComponent,
} from '@maplibre/ngx-maplibre-gl';

@Component({
  selector: 'cockpit-activity-tracking-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MapComponent,
    GeoJSONSourceComponent,
    LayerComponent,
  ],
  templateUrl: './activity-tracking-page.component.html',
  styleUrl: './activity-tracking-page.component.scss',
})
export class ActivityTrackingPageComponent {
  stopTracking$ = new Subject();

  zoom: [number] = [18];
  pitch: [number] = [30];

  trackedActivity$ = this._store.select(currentTrackingInfoSelector);
  currentPosition$: Observable<[number, number]> = this.trackedActivity$.pipe(
    map((activity) =>
      activity && activity.locations && activity.locations.length
        ? [activity.locations[0].long, activity.locations[0].lat]
        : [0, 0]
    )
  );

  geometry$: Observable<GeoJSON.FeatureCollection<GeoJSON.LineString>> =
    this.trackedActivity$.pipe(
      map((activity) => ({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry:
              activity && activity.locations && activity.locations.length
                ? {
                    type: 'LineString',
                    coordinates: activity.locations.map((location) => [
                      location.long,
                      location.lat,
                    ]),
                  }
                : {
                    type: 'LineString',
                    coordinates: [],
                  },
          },
        ],
      }))
    );

  duration$ = combineLatest([
    interval(1000).pipe(takeUntil(this.stopTracking$)),
    this.trackedActivity$,
  ]).pipe(
    map(([_, activity]) =>
      activity && activity.startTime
        ? Math.floor(
            (new Date().getTime() - new Date(activity.startTime).getTime()) /
              1000
          )
        : 0
    )
  );

  constructor(private readonly _store: Store) {}

  stop() {
    this.stopTracking$.next(null);
    this.stopTracking$.complete();
    this._store.dispatch(TrackingActions.stopTracking());
  }
}
