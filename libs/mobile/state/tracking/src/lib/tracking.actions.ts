import { createActionGroup, props } from '@ngrx/store';
import { CurrentTrackedActivity } from '@cockpit/mobile/data-models';
import { Location } from '@transistorsoft/capacitor-background-geolocation';

export const TrackingActions = createActionGroup({
  source: 'Tracking',
  events: {
    'Start Tracking': props<any>(),
    'Start Tracking Success': props<{ activity: CurrentTrackedActivity }>(),
    'Start Tracking Failure': props<{ error: string }>(),
    'Stop Tracking': props<any>(),
    'Stop Tracking Success': props<any>(),
    'Stop Tracking Failure': props<{ error: string }>(),
    'Add Location': props<{ location: Location }>(),
    'Tracked Activity Found In Storage': props<{
      activity: CurrentTrackedActivity;
    }>(),
    'Tracked Activity Not Found In Storage': props<any>(),
    'Tracked Activity Created': props<any>(),
  },
});
