import { Injectable } from '@angular/core';
import BackgroundGeolocation, { Location, Subscription as GeolocationSubscription } from '@transistorsoft/capacitor-background-geolocation';
import { BehaviorSubject, share, Subscription, tap } from 'rxjs';
import { TrackedActivity } from './tracked-activity.interface';
import { calculateDistance } from '@cockpit/distance';
import { StorageKey } from '@cockpit/constants';
import { TestActivity } from '@cockpit/data-models';

const updateLocations = (subject: BehaviorSubject<TrackedActivity | null>) => (location: Location) => {
  const trackedActivity = subject.value;

  if (trackedActivity) {
    const { locations } = trackedActivity;
    if (locations.length) {
      const previousLocation = locations[0];
      const distanceBetween = calculateDistance(previousLocation.lat, previousLocation.lon, location.coords.latitude, location.coords.longitude);

      if (distanceBetween < 0.001) {
        return;
      }

      trackedActivity.distance += distanceBetween;
    }

    locations.unshift({ lat: location.coords.latitude, lon: location.coords.longitude });
    subject.next({ ...trackedActivity, locations });
  }
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private _trackedActivity$$ = new BehaviorSubject<TrackedActivity | null>(null);
  public trackedActivity$ = this._trackedActivity$$.asObservable().pipe(share());

  private trackingSub?: Subscription;
  private locationTrackingSub?: GeolocationSubscription;

  setTrackedActivity(activity: TrackedActivity) {
    this._trackedActivity$$.next(activity);
  }

  async startTracking(): Promise<boolean> {
    this.trackingSub = this.trackedActivity$.pipe(
      tap(activity => activity ? localStorage.setItem(StorageKey.TRACKED_ACTIVITY, JSON.stringify(activity)) : void 0)
    ).subscribe();
    this._trackedActivity$$.next({
      startTime: new Date(),
      distance: 0,
      locations: []
    });

    /// Step 1:  Subscribe to BackgroundGeolocation events.
    this.locationTrackingSub = BackgroundGeolocation.onLocation(updateLocations(this._trackedActivity$$));

    /// Step 2:  Ready the plugin.
    await BackgroundGeolocation.ready({
      backgroundPermissionRationale: {
        title: `Allow Run Across America access to this device's location in the background?`,
        message: `In order to track your activities in the background, please enable 'Allow all the time' location permission`,
        positiveAction: `Change to 'Allow all the time'`,
        negativeAction: 'Cancel'
      },
      reset: true,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 1,
      autoSync: false,
      stopOnTerminate: false,
      startOnBoot: true,
      activityType: BackgroundGeolocation.ACTIVITY_TYPE_FITNESS,
      fastestLocationUpdateInterval: 2000,
      locationUpdateInterval: 2000,
      stopOnStationary: false,
      showsBackgroundLocationIndicator: true,
      foregroundService: true,
      notification: {
        text: 'Run Across America is tracking your activity!',
        title: 'Run Across America is using your location',
        sticky: true,
        smallIcon: 'drawable/notification_icon',
        largeIcon: 'drawable/notification_icon'
      },
      disableElasticity: true,
      elasticityMultiplier: 1,
      geofenceProximityRadius: 1000,
      useSignificantChangesOnly: false,
      locationTimeout: 30,
      deferTime: 0,
      geofenceModeHighAccuracy: true,
      disableMotionActivityUpdates: false,
      stopTimeout: 1,
      motionTriggerDelay: 0,
      disableStopDetection: true,
      isMoving: true,
      disableLocationAuthorizationAlert: true,
    });

    const state = await BackgroundGeolocation.start();

    return state.enabled;
  }

  async stopTracking(): Promise<Omit<TestActivity, 'id'>> {
    const trackedActivity = this._trackedActivity$$.value;
    localStorage.removeItem(StorageKey.TRACKED_ACTIVITY);
    this.trackingSub?.unsubscribe();
    this.locationTrackingSub?.remove();
    this._trackedActivity$$.next(null);
    await BackgroundGeolocation.stop();

    return {
      distance: trackedActivity?.distance || 0,
      duration: Math.floor((new Date().getTime() - (trackedActivity?.startTime ? new Date(trackedActivity?.startTime) : new Date()).getTime()) / 1000),
      image: '',
    };
  }
}
