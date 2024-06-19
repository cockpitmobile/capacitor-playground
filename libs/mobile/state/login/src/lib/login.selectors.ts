import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginState } from './state.model';
import {
  DEFAULT_APP_WELCOME_TEXT,
  DEFAULT_NEW_USER_SIGN_UP_LINK,
  RAA_RED,
  RAA_RED_SECONDARY,
  RunAcrossAmericaLogo,
} from '@cockpit/mobile/util/constants';

const loginState = createFeatureSelector<LoginState>('login');

export const currentSeason = createSelector(
  loginState,
  (state) => state.currentSeason
);

export const currentSeasonPrimaryColor = createSelector(
  currentSeason,
  (season) => season?.race_primary_color || RAA_RED
);

export const currentSeasonSecondaryColor = createSelector(
  currentSeason,
  (season) => season?.race_secondary_color || RAA_RED_SECONDARY
);

export const currentSeasonOnboardingImageLink = createSelector(
  currentSeason,
  (season) => season?.onboarding_image_link || RunAcrossAmericaLogo
);

export const currentSeasonWelcomeText = createSelector(
  currentSeason,
  (season) => season?.app_welcome_text || DEFAULT_APP_WELCOME_TEXT
);

export const currentSeasonNewUserSignUpLink = createSelector(
  currentSeason,
  (season) => season?.new_account_link || DEFAULT_NEW_USER_SIGN_UP_LINK
);

export const loginStep = createSelector(loginState, (state) => state.loginStep);

export const foundUser = createSelector(loginState, (state) => state.foundUser);
