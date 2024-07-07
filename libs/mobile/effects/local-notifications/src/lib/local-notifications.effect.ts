import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, map, of, switchMap } from 'rxjs';
import { LocalNotificationsActions } from '@cockpit/mobile/state/local-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable()
export class LocalNotificationsEffect {
  private readonly _actions = inject(Actions);

  checkPermissions$ = createEffect(() =>
    this._actions.pipe(
      ofType(LocalNotificationsActions.notificationRequested),
      switchMap(({ options }) =>
        from(LocalNotifications.checkPermissions()).pipe(
          switchMap((permissions) =>
            permissions.display === 'granted'
              ? of(true).pipe(
                  map(() =>
                    LocalNotificationsActions.permissionRequested({ options })
                  )
                )
              : from(LocalNotifications.requestPermissions()).pipe(
                  map((requestedPermissions) =>
                    requestedPermissions.display === 'denied'
                      ? LocalNotificationsActions.notificationScheduledFailed()
                      : LocalNotificationsActions.permissionRequested({
                          options,
                        })
                  )
                )
          )
        )
      )
    )
  );

  schedule$ = createEffect(() =>
    this._actions.pipe(
      ofType(LocalNotificationsActions.permissionRequested),
      switchMap(({ options }) =>
        from(LocalNotifications.schedule({ ...options })).pipe(
          map(() => LocalNotificationsActions.notificationScheduledSuccess())
        )
      )
    )
  );
}
