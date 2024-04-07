import { createActionGroup, props } from '@ngrx/store';
import { TestActivity } from '@cockpit/data-models';

export const ActivitiesActions = createActionGroup({
  source: 'Activities',
  events: {
    'Add Activity': props<{ activity: Omit<TestActivity, 'id'> }>(),
  }
});

export const ActivitiesApiActions = createActionGroup({
  source: 'Activities API',
  events: {
    'Create Activity': props<{ activity: TestActivity }>(),
    'Create Activity Success': props<{ activity: TestActivity }>(),
    'Create Activity Failure': props<{ error: string }>(),
    'Load Activities': props<any>(),
    'Load Activities From Storage Success': props<{ activities: TestActivity[] }>(),
    'Load Activities From Storage No Activities': props<any>(),
    'Load Activities Success': props<{ activities: TestActivity[] }>(),
    'Load Activities Failure': props<{ error: string }>(),
  }
});
