import { createActionGroup, props } from '@ngrx/store';
import { ActivityType } from '@prisma/client';

export const GlobalActions = createActionGroup({
  source: 'Global',
  events: {
    'Activity Types Loaded from Storage': props<{
      activityTypes: ActivityType[];
    }>(),
    'Load Activity Types': props<any>(),
    'Load Activity Types Success': props<{ activityTypes: ActivityType[] }>(),
    'Load Activity Types Failure': props<any>(),
  },
});
