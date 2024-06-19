import { createActionGroup, props } from '@ngrx/store';

export const InAppBrowserActions = createActionGroup({
  source: 'InAppBrowser',
  events: {
    'Open Web Page': props<{ url: string; inApp: boolean }>(),
  },
});
