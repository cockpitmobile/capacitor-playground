import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ShareActions } from '@cockpit/mobile/state/share';
import { from, map, switchMap } from 'rxjs';
import { Share } from '@capacitor/share';

@Injectable()
export class ShareEffects {
  private readonly _actions = inject(Actions);

  shareRequested$ = createEffect(() =>
    this._actions.pipe(
      ofType(ShareActions.shareRequested),
      switchMap(({ options }) =>
        from(Share.share(options)).pipe(
          map((result) => ShareActions.shareSucceeded())
        )
      )
    )
  );
}
