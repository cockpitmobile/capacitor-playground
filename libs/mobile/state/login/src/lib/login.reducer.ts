import { createReducer, on } from '@ngrx/store';
import { LoginState } from './state.model';
import { LoginActions } from './login.actions';

const initialState: LoginState = {
  currentSeason: undefined,
  loginStep: 'projectLogin',
};

export const loginReducer = createReducer(
  initialState,
  on(
    LoginActions.loadCurrentSeasonSuccess,
    (state: LoginState, { currentSeason }): LoginState => ({
      ...state,
      currentSeason,
    })
  ),
  on(
    LoginActions.userFoundWithEmail,
    (state: LoginState, { user }): LoginState => ({
      ...state,
      foundUser: user,
      loginStep: 'hasEmail',
    })
  ),
  on(
    LoginActions.userNotFoundWithEmail,
    (state: LoginState): LoginState => ({
      ...state,
      loginStep: 'noEmail',
    })
  ),
  on(
    LoginActions.backToLoginClicked,
    (state: LoginState): LoginState => ({
      ...state,
      loginStep: 'projectLogin',
    })
  ),
  on(
    LoginActions.hasLoginCodeClicked,
    (state: LoginState): LoginState => ({
      ...state,
      loginStep: 'code',
    })
  ),
  on(
    LoginActions.sendNewAccessCodeSuccess,
    (state: LoginState): LoginState => ({
      ...state,
      loginStep: 'code',
    })
  )
);
