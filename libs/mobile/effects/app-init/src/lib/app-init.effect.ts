import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { AppStorageService } from '@cockpit/mobile/storage';
import { appReady } from '@cockpit/mobile/app-lifecycle-state';
import { map, switchMap, tap } from 'rxjs';
import { StorageKey } from '@cockpit/mobile/constants';
import { TrackingActions } from '@cockpit/mobile/tracking-state';
import { CurrentTrackedActivity } from '@cockpit/mobile/data-models';
import { TrackingService } from '@cockpit/mobile/tracking';
import { NetworkService } from '@cockpit/mobile/network';
import { ActivityTypesService } from '@cockpit/mobile/data-access/activity-types';
import { GlobalActions } from '@cockpit/mobile/state/global';
import { ActivityType } from '@prisma/client';

@Injectable()
export class AppInitEffect {
  private readonly _activityTypes = inject(ActivityTypesService);

  checkForTrackedActivity$ = createEffect(() =>
    this._actions$.pipe(
      ofType(appReady),
      switchMap(() =>
        this._storage
          .getData<CurrentTrackedActivity>(StorageKey.TRACKED_ACTIVITY)
          .pipe(
            map((activity) =>
              activity
                ? TrackingActions.trackedActivityFoundInStorage({
                    activity: {
                      ...activity,
                      startTime: new Date(activity.startTime),
                    },
                  })
                : TrackingActions.trackedActivityNotFoundInStorage()
            )
          )
      )
    )
  );

  loadActivityTypesFromStorage$ = createEffect(() =>
    this._actions$.pipe(
      ofType(appReady),
      switchMap(() =>
        this._storage.getData<ActivityType[]>(StorageKey.ACTIVITY_TYPES).pipe(
          map((activityTypes) =>
            GlobalActions.activityTypesLoadedFromStorage({
              activityTypes: activityTypes || [],
            })
          )
        )
      )
    )
  );

  loadActivityTypes$ = createEffect(() =>
    this._actions$.pipe(
      ofType(GlobalActions.activityTypesLoadedFromStorage),
      switchMap(() =>
        this._activityTypes
          .getAll()
          .pipe(
            switchMap((activityTypes) =>
              this._storage
                .setData(StorageKey.ACTIVITY_TYPES, activityTypes)
                .pipe(
                  map(() =>
                    GlobalActions.loadActivityTypesSuccess({ activityTypes })
                  )
                )
            )
          )
      )
    )
  );

  routeToTrackActivity$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(TrackingActions.trackedActivityFoundInStorage),
        tap(() => this._tracking.setupLocationTracking()),
        map(() => this._router.navigate(['/track-activity']))
      ),
    { dispatch: false }
  );

  routeWithNoTrackedActivity$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(TrackingActions.trackedActivityNotFoundInStorage),
        map(() => this._router.navigate(['/test']))
      ),
    { dispatch: false }
  );

  startNetworkListening$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(appReady),
        switchMap(() => this._network.setupNetworkListener())
      ),
    { dispatch: false }
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _router: Router,
    private readonly _storage: AppStorageService,
    private readonly _tracking: TrackingService,
    private readonly _network: NetworkService
  ) {}
}
