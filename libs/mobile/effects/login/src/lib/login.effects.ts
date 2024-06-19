import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { LoginActions } from '@cockpit/mobile/state/login';
import { UsersService } from '@cockpit/mobile-data-access-users';

@Injectable()
export class LoginEffects {
  private readonly _actions = inject(Actions);
  private readonly _usersService = inject(UsersService);

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
}
