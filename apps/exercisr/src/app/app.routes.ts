import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('@cockpit/mobile/login-page').then((m) => m.LoginComponent),
  },
  {
    path: 'user',
    loadComponent: () =>
      import('@cockpit/shell-page').then((m) => m.ShellPageComponent),
    loadChildren: () => [
      {
        path: 'event-list',
        loadComponent: () =>
          import('@cockpit/event-selection-list-page').then(
            (m) => m.EventSelectionListPageComponent
          ),
      },
      {
        path: 'current-event',
        loadComponent: () =>
          import('@cockpit/current-event-page').then(
            (m) => m.CurrentEventPageComponent
          ),
      },
      {
        path: 'teams',
        loadComponent: () =>
          import('@cockpit/user-teams-page').then(
            (m) => m.UserTeamsPageComponent
          ),
      },
    ],
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
