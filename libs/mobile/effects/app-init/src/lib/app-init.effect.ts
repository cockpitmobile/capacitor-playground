import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { AppStorageService } from '@cockpit/storage';
import { appReady } from '@cockpit/app-lifecycle-state';
import { map, switchMap, tap } from 'rxjs';
import { StorageKey } from '@cockpit/constants';
import { TrackingActions } from '@cockpit/tracking-state';
import { CurrentTrackedActivity } from '@cockpit/data-models';
import { TrackingService } from '@cockpit/tracking';

@Injectable()
export class AppInitEffect {

  checkForTrackedActivity$ = createEffect(() => this._actions$.pipe(
    ofType(appReady),
    switchMap(() => this._storage.getData<CurrentTrackedActivity>(StorageKey.TRACKED_ACTIVITY).pipe(
      map(activity => activity ? TrackingActions.trackedActivityFoundInStorage({ activity: {
        ...activity,
          startTime: new Date(activity.startTime)
        }
      }) : TrackingActions.trackedActivityNotFoundInStorage())
    ))
  ));

  routeToTrackActivity$ = createEffect(() => this._actions$.pipe(
    ofType(TrackingActions.trackedActivityFoundInStorage),
    tap(() => this._tracking.setupLocationTracking()),
    map(() => this._router.navigate(['/track-activity']))
  ), { dispatch: false });

  routeWithNoTrackedActivity$ = createEffect(() => this._actions$.pipe(
    ofType(TrackingActions.trackedActivityNotFoundInStorage),
    map(() => this._router.navigate(['/test']))
  ), { dispatch: false });


  constructor(
    private readonly _actions$: Actions,
    private readonly _router: Router,
    private readonly _storage: AppStorageService,
    private readonly _tracking: TrackingService
  ) {}
}
