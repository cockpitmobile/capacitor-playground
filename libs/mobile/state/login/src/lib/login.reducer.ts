import { createReducer, on } from '@ngrx/store';
import { LoginState } from './state.model';
import { LoginActions } from './login.actions';

const initialState: LoginState = {
  currentSeason: undefined,
};

export const loginReducer = createReducer(
  initialState,
  on(
    LoginActions.loadCurrentSeasonSuccess,
    (state: LoginState, { currentSeason }): LoginState => ({
      ...state,
      currentSeason,
    })
  )
);
