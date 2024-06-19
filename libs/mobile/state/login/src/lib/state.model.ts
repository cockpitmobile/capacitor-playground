import { LoginStep, User } from '@cockpit/mobile/data-models';

export interface CurrentSeason {
  race_primary_color?: string;
  race_secondary_color?: string;
  app_welcome_text?: string;
  onboarding_image_link?: string;
  new_account_link?: string;
}

export interface LoginState {
  currentSeason?: CurrentSeason;
  loginStep: LoginStep;
  foundUser?: User;
}
