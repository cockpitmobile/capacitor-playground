import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  ActivitiesApiActions,
  sortedActivitiesSelector,
} from '@cockpit/mobile/activities-state';
import { TrackingActions } from '@cockpit/mobile/tracking-state';
import {
  networkIsConnectedSelector,
  networkIsSyncingSelector,
} from '@cockpit/mobile/network-state';
import { selfieRequested } from '@cockpit/mobile/selfies-state';
import { ActivitySelectorComponent } from '@cockpit/mobile/components/activity-selector';
import {
  allActivityTypesSorted,
  allFeaturedActivityTypes,
} from '@cockpit/mobile/state/global';
import { LocalNotificationsActions } from '@cockpit/mobile/state/local-notifications';
import { ShareActions } from '@cockpit/mobile/state/share';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'cockpit-event-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    ActivitySelectorComponent,
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent {
  activities$ = this._store.select(sortedActivitiesSelector);
  isConnected$ = this._store.select(networkIsConnectedSelector);
  isSyncing$ = this._store.select(networkIsSyncingSelector);
  featuredActivityTypes$ = this._store.select(allFeaturedActivityTypes);
  allActivityTypes$ = this._store.select(allActivityTypesSorted);

  constructor(private readonly _store: Store) {
    this._store.dispatch(ActivitiesApiActions.loadActivities());
  }

  start() {
    this._store.dispatch(TrackingActions.startTracking());
  }

  requestLocalNotifications() {
    this._store.dispatch(
      LocalNotificationsActions.notificationRequested({
        options: {
          notifications: [
            {
              id: 1,
              title: 'TESTING REMINDERS',
              body: 'This is a test reminder',
              // schedule: { at: new Date(Date.now() + 1000 * 5) },
            },
          ],
        },
      })
    );
  }

  share() {
    this._store.dispatch(
      ShareActions.shareRequested({
        options: {
          title: 'Share something',
          text: 'This is a test share',
          dialogTitle: 'Share with friends',
        },
      })
    );
  }

  requestPhoto(id: number) {
    this._store.dispatch(
      selfieRequested({ title: '', id, image_type: 'selfie' })
    );
  }
}
