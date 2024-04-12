import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import 'zone.js/plugins/zone-patch-rxjs';
import { Store } from '@ngrx/store';
import { appReady } from '@cockpit/app-lifecycle-state';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'cockpit-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'exercisr';

  constructor(private readonly _store: Store) {}

  ngOnInit() {
    BackgroundGeolocation.ready({
      backgroundPermissionRationale: {
        title: `Allow Run Across America access to this device's location in the background?`,
        message: `In order to track your activities in the background, please enable 'Allow all the time' location permission`,
        positiveAction: `Change to 'Allow all the time'`,
        negativeAction: 'Cancel',
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
        largeIcon: 'drawable/notification_icon',
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
      maxRecordsToPersist: 0,
    })
      .then(() => {
        console.log('BackgroundGeolocation ready');
      })
      .catch((err) => {
        console.log('BackgroundGeolocation error', err);
      })
      .finally(() => this._store.dispatch(appReady()));
  }
}
