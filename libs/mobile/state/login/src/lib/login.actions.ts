import { createActionGroup, props } from '@ngrx/store';
import { CurrentSeason } from './state.model';
import { User } from '@cockpit/mobile/data-models';

export const LoginActions = createActionGroup({
  source: 'Login',
  events: {
    'Load Current Season': props<any>(),
    'Load Current Season Success': props<{ currentSeason: CurrentSeason }>(),
    'Load Current Season Failure': props<{ error: string }>(),
    'Load User with Email': props<{ email: string }>(),
    'User Found with Email': props<{ user: User }>(),
    'User Not Found with Email': props<any>(),
    'Load User with Email Failure': props<{ error: string }>(),
  },
});
