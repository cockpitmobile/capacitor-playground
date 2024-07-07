import { createActionGroup, props } from '@ngrx/store';
import { ShareOptions } from '@capacitor/share';

export const ShareActions = createActionGroup({
  source: 'Share',
  events: {
    'Share Requested': props<{ options: ShareOptions }>(),
    'Share Succeeded': props<any>(),
    'Share Failed': props<any>(),
  },
});
