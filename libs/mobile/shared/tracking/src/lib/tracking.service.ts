import { Injectable } from '@angular/core';
import BackgroundGeolocation, { Subscription as GeolocationSubscription } from '@transistorsoft/capacitor-background-geolocation';
import { from, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TrackingActions } from '@cockpit/tracking-state';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private locationTrackingSub?: GeolocationSubscription;

  constructor(
    private readonly _store: Store
  ) {}

  setupLocationTracking(): void {
    if (!this.locationTrackingSub) {
      this.locationTrackingSub = BackgroundGeolocation.onLocation(location => {
        this._store.dispatch(TrackingActions.addLocation({ location }));
      });
    }
  }

  stopLocationTracking(): void {
    this.locationTrackingSub?.remove();
    this.locationTrackingSub = undefined;
  }

  startTracking(): Observable<boolean> {
    this.setupLocationTracking();

    return from(BackgroundGeolocation.start()).pipe(
      map(state => state.enabled)
    );
  }

  stopTracking(): Observable<boolean> {
    return from(BackgroundGeolocation.stop()).pipe(
      map(state => state.enabled)
    );
  }
}
