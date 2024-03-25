import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'test',
    loadComponent: () => import('@cockpit/event-page').then(m => m.EventPageComponent)
  },
  {
    path: 'track-activity',
    loadComponent: () => import('@cockpit/activity-tracking-page').then(m => m.ActivityTrackingPageComponent)
  }
];
