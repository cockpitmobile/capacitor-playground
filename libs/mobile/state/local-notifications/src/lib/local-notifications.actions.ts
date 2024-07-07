import { createActionGroup, props } from '@ngrx/store';
import { ScheduleOptions } from '@capacitor/local-notifications';

export const LocalNotificationsActions = createActionGroup({
  source: 'LocalNotifications',
  events: {
    'Notification Requested': props<{ options: ScheduleOptions }>(),
    'Permission Requested': props<{ options: ScheduleOptions }>(),
    'Notification Scheduled Success': props<any>(),
    'Notification Scheduled Failed': props<any>(),
  },
});
