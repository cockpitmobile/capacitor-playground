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
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 1,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
    }).then((state) => {
      BackgroundGeolocation.start();
    });
  }
}
