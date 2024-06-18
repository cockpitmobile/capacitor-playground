import { createActionGroup, props } from '@ngrx/store';
import { CurrentSeason } from './state.model';

export const LoginActions = createActionGroup({
  source: 'Login',
  events: {
    'Load Current Season': props<any>(),
    'Load Current Season Success': props<{ currentSeason: CurrentSeason }>(),
    'Load Current Season Failure': props<{ error: string }>(),
  },
});
