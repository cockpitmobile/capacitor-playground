import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('@cockpit/mobile/login-page').then((m) => m.LoginComponent),
  },
  {
    path: 'test',
    loadComponent: () =>
      import('@cockpit/mobile/event-page').then((m) => m.EventPageComponent),
  },
  {
    path: 'track-activity',
    loadComponent: () =>
      import('@cockpit/mobile/activity-tracking-page').then(
        (m) => m.ActivityTrackingPageComponent
      ),
  },
];
