import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';

@Component({
  selector: 'cockpit-event-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent {
  hello() {
    /// Step 1:  Subscribe to BackgroundGeolocation events.
    BackgroundGeolocation.onLocation((location) => {
      console.log(JSON.stringify(location));
    });

    /// Step 2:  Ready the plugin.
    BackgroundGeolocation.ready({
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
    }).then((state) => {
      BackgroundGeolocation.start();
    });
  }
}
