import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { currentTrackingInfoSelector, TrackingActions } from '@cockpit/tracking-state';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { TrackingService } from '@cockpit/tracking';
import { AppStorageService } from '@cockpit/storage';
import { StorageKey } from '@cockpit/constants';
import { Store } from '@ngrx/store';
import { ActivitiesActions, ActivitiesApiActions } from '@cockpit/activities-state';

@Injectable()
export class TrackingEffects {
  startTracking$ = createEffect(() => this._actions$.pipe(
    ofType(TrackingActions.startTracking),
    switchMap(() => this._tracking.startTracking().pipe(
      map(enabled => enabled ? TrackingActions.startTrackingSuccess({
        activity: {
          startTime: new Date(),
          distance: 0,
          locations: []
        }
      }) : TrackingActions.startTrackingFailure({ error: 'Could not start tracking services' }))
    ))
  ));

  stopTracking$ = createEffect(() => this._actions$.pipe(
    ofType(TrackingActions.stopTracking),
    tap(() => console.log('STOPPING TRACKING')),
    switchMap(() => this._storage.removeData(StorageKey.TRACKED_ACTIVITY).pipe(
      tap(() => console.log('REMOVED DATA')),
      switchMap(() => this._tracking.stopTracking().pipe(
        map(enabled => !enabled ? TrackingActions.stopTrackingSuccess() : TrackingActions.stopTrackingFailure({ error: 'Could not stop tracking services' }))
      ))
    )),
  ));

  addActivity$ = createEffect(() => this._actions$.pipe(
    ofType(TrackingActions.stopTrackingSuccess),
    withLatestFrom(this._store.select(currentTrackingInfoSelector)),
    filter(([, activity]) => !!activity && !!activity.endTime),
    map(([, activity]) => ActivitiesActions.addActivity({
      activity: {
        distance: activity!.distance,
        duration: Math.floor((activity!.endTime!.getTime() - new Date(activity!.startTime).getTime()) / 1000),
        image: ''
      }
    }))
  ));

  activitySent$ = createEffect(() => this._actions$.pipe(
    ofType(ActivitiesApiActions.createActivitySuccess),
    map(() => TrackingActions.trackedActivityCreated())
  ));


  navigateHome$ = createEffect(() => this._actions$.pipe(
    ofType(TrackingActions.trackedActivityCreated),
    map(() => this._router.navigate(['/test']))
  ), { dispatch: false });



  storeActivity$ = createEffect(() => this._actions$.pipe(
    ofType(TrackingActions.startTrackingSuccess, TrackingActions.addLocation),
    withLatestFrom(this._store.select(currentTrackingInfoSelector)),
    tap(() => console.log('STORING DATA')),
    switchMap(([_, activity]) => this._storage.setData(StorageKey.TRACKED_ACTIVITY, activity))
  ), { dispatch: false });

  routeToTrackActivity$ = createEffect(() => this._actions$.pipe(
    ofType(TrackingActions.startTrackingSuccess),
    map(() => this._router.navigate(['/track-activity']))
  ), { dispatch: false });


  constructor(
    private readonly _actions$: Actions,
    private readonly _tracking: TrackingService,
    private readonly _router: Router,
    private readonly _storage: AppStorageService,
    private readonly _store: Store
  ) { }
}
