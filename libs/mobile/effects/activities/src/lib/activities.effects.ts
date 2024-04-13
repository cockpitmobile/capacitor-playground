import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ActivitiesActions,
  ActivitiesApiActions,
  activitiesSelector,
} from '@cockpit/mobile/activities-state';
import { AppStorageService } from '@cockpit/mobile/storage';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { TestActivity } from '@cockpit/mobile/data-models';
import { StorageKey } from '@cockpit/mobile/constants';
import { ActivitiesService } from '@cockpit/mobile/activities';
import { Store } from '@ngrx/store';
import { selfieUploaded } from '@cockpit/mobile/selfies-state';
import { networkSyncingChanged } from '@cockpit/mobile/network-state';

@Injectable()
export class ActivitiesEffects {
  loadOnSyncSuccess$ = createEffect(() =>
    this._actions$.pipe(
      ofType(networkSyncingChanged),
      filter(({ syncing }) => !syncing),
      map(() => ActivitiesApiActions.loadActivities())
    )
  );

  loadActivitiesFromStorage$ = createEffect(() =>
    this._actions$.pipe(
      ofType(ActivitiesApiActions.loadActivities),
      switchMap(() =>
        this._storage.getData<TestActivity[]>(StorageKey.ACTIVITIES).pipe(
          map((activities) =>
            activities
              ? ActivitiesApiActions.loadActivitiesFromStorageSuccess({
                  activities,
                })
              : ActivitiesApiActions.loadActivitiesFromStorageNoActivities()
          )
        )
      )
    )
  );

  loadActivitiesFromApi$ = createEffect(() =>
    this._actions$.pipe(
      ofType(
        ActivitiesApiActions.loadActivitiesFromStorageNoActivities,
        ActivitiesApiActions.loadActivitiesFromStorageSuccess
      ),
      switchMap(() =>
        this._activitiesService
          .getActivitesFromAPI()
          .pipe(
            switchMap((activities) =>
              this._storage
                .setData(StorageKey.ACTIVITIES, activities)
                .pipe(
                  map(() =>
                    ActivitiesApiActions.loadActivitiesSuccess({ activities })
                  )
                )
            )
          )
      )
    )
  );

  addActivity$ = createEffect(() =>
    this._actions$.pipe(
      ofType(ActivitiesActions.addActivity),
      withLatestFrom(this._store.select(activitiesSelector)),
      map(([{ activity }, activities]) => ({
        ...activity,
        id: Math.max(...activities.map((x) => x.id), 0) + 1,
      })),

      map((activity) => ActivitiesApiActions.createActivity({ activity }))
    )
  );

  createActivityApi$ = createEffect(() =>
    this._actions$.pipe(
      ofType(ActivitiesApiActions.createActivity),
      withLatestFrom(this._store.select(activitiesSelector)),
      switchMap(([{ activity }, activities]) =>
        this._storage
          .setData(StorageKey.ACTIVITIES, activities)
          .pipe(
            switchMap(() =>
              this._activitiesService
                .createTestActivity(activity)
                .pipe(
                  map(() =>
                    ActivitiesApiActions.createActivitySuccess({ activity })
                  )
                )
            )
          )
      )
    )
  );

  selfieUploaded$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(selfieUploaded),
        withLatestFrom(this._store.select(activitiesSelector)),
        switchMap(([, activities]) =>
          this._storage.setData(StorageKey.ACTIVITIES, activities)
        )
      ),
    { dispatch: false }
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _activitiesService: ActivitiesService,
    private readonly _storage: AppStorageService,
    private readonly _store: Store
  ) {}
}
