import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InAppBrowserActions } from '@cockpit/state-in-app-browser';
import { tap } from 'rxjs';
import { Browser } from '@capacitor/browser';

@Injectable()
export class InAppBrowserEffects {
  private readonly _actions = inject(Actions);

  openWebPage$ = createEffect(
    () =>
      this._actions.pipe(
        ofType(InAppBrowserActions.openWebPage),
        tap(({ url, inApp }) =>
          Browser.open({
            url,
            windowName: inApp ? '_blank' : '_system',
          })
        )
      ),
    { dispatch: false }
  );
}
