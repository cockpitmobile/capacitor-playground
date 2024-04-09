import { Injectable } from '@angular/core';
import { HttpService } from '@cockpit/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs';
import {
  networkIsConnectedSelector,
  networkStateChanged,
  networkSyncingChanged,
  selectUrl,
} from '@cockpit/network-state';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';

@Injectable()
export class NetworkSyncEffect {
  networkStateChangeSync$ = createEffect(() =>
    this._actions.pipe(
      ofType(networkStateChanged),
      withLatestFrom(this._store.select(selectUrl)),
      filter(([{ isConnected }, url]) =>
        Boolean(isConnected && url && url.includes('/test'))
      ),
      switchMap(() =>
        this._http
          .sync()
          .pipe(map(() => networkSyncingChanged({ syncing: false })))
      )
    )
  );

  routerStateChangeSync$ = createEffect(() =>
    this._actions.pipe(
      ofType(routerNavigatedAction),
      withLatestFrom(this._store.select(networkIsConnectedSelector)),
      filter(([nav, isConnected]) =>
        Boolean(nav.payload.routerState.url.includes('/test') && isConnected)
      ),
      switchMap(() =>
        this._http
          .sync()
          .pipe(map(() => networkSyncingChanged({ syncing: false })))
      )
    )
  );

  constructor(
    private readonly _actions: Actions,
    private readonly _http: HttpService,
    private readonly _store: Store
  ) {}
}
