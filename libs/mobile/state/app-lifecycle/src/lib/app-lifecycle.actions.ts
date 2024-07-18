import { createAction, props } from '@ngrx/store';

export const appReady = createAction('[App Lifecycle] App Ready');
export const capCloudReady = createAction(
  '[App Lifecycle] Capacitor Cloud Ready'
);
export const capCloudSynced = createAction(
  '[App Lifecycle] Capacitor Cloud Synced'
);

export const pushNotificationsRegisteredSuccessfully = createAction(
  '[App Lifecycle] Push Notifications Registered Successfully'
);
export const pushNotificationsRegistrationFailed = createAction(
  '[App Lifecycle] Push Notifications Registration Failed'
);
export const pushNotificationTokenRegistered = createAction(
  '[App Lifecycle] Push Notification Token Registered',
  props<{ token: string }>()
);
