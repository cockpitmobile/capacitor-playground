import { createAction } from '@ngrx/store';

export const appReady = createAction('[App Lifecycle] App Ready');
export const capCloudReady = createAction(
  '[App Lifecycle] Capacitor Cloud Ready'
);
export const capCloudSynced = createAction(
  '[App Lifecycle] Capacitor Cloud Synced'
);
