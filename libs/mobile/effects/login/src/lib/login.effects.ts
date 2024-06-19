import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs';
import {
  currentSeasonNewUserSignUpLink,
  LoginActions,
} from '@cockpit/mobile/state/login';
import { UsersService } from '@cockpit/mobile-data-access-users';
import { Store } from '@ngrx/store';
import { InAppBrowserActions } from '@cockpit/state-in-app-browser';

@Injectable()
export class LoginEffects {
  private readonly _actions = inject(Actions);
  private readonly _usersService = inject(UsersService);
  private readonly _store = inject(Store);

  loadUser$ = createEffect(() =>
    this._actions.pipe(
      ofType(LoginActions.loadUserWithEmail),
      switchMap(({ email }) =>
        this._usersService
          .getUserByEmailAddress(email)
          .pipe(
            map((user) =>
              user.length
                ? LoginActions.userFoundWithEmail({ user: user[0] })
                : LoginActions.userNotFoundWithEmail()
            )
          )
      )
    )
  );

  createNewAccount$ = createEffect(() =>
    this._actions.pipe(
      ofType(LoginActions.createNewAccount),
      withLatestFrom(this._store.select(currentSeasonNewUserSignUpLink)),
      map(([{ email, sendEmailUpdates }, signUpLink]) =>
        InAppBrowserActions.openWebPage({
          url: `${signUpLink}?email=${email}&agreeEventUpdates=${sendEmailUpdates}`,
          inApp: false,
        })
      )
    )
  );

  sendNewAccessCode$ = createEffect(() =>
    this._actions.pipe(
      ofType(LoginActions.sendNewAccessCode),
      switchMap(({ email }) =>
        this._usersService
          .sendResetAccessCodeEmail(email)
          .pipe(map(() => LoginActions.sendNewAccessCodeSuccess()))
      )
    )
  );
}
