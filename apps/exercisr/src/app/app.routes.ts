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
        path: 'explore',
        loadComponent: () =>
          import('@cockpit/event-explore-page').then(
            (m) => m.EventExplorePageComponent
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
      {
        path: 'badges',
        loadComponent: () =>
          import('@cockpit/user-badges').then((m) => m.UserBadgesPageComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@cockpit/user-settings-page').then(
            (m) => m.UserSettingsPageComponent
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
