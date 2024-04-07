import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActivitiesActions, ActivitiesApiActions, activitiesSelector } from '@cockpit/activities-state';
import { AppStorageService } from '@cockpit/storage';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { TestActivity } from '@cockpit/data-models';
import { StorageKey } from '@cockpit/constants';
import { ActivitiesService } from '@cockpit/activities';
import { Store } from '@ngrx/store';

@Injectable()
export class ActivitiesEffects {
  loadActivitiesFromStorage$ = createEffect(() => this._actions$.pipe(
    ofType(ActivitiesApiActions.loadActivities),
    switchMap(() => this._storage.getData<TestActivity[]>(StorageKey.ACTIVITIES).pipe(
      map(activities => activities ? ActivitiesApiActions.loadActivitiesFromStorageSuccess({ activities }) : ActivitiesApiActions.loadActivitiesFromStorageNoActivities())
    ))
  ));

  loadActivitiesFromApi$ = createEffect(() => this._actions$.pipe(
    ofType(ActivitiesApiActions.loadActivitiesFromStorageNoActivities, ActivitiesApiActions.loadActivitiesFromStorageSuccess),
    switchMap(() => this._activitiesService.getActivitesFromAPI().pipe(
      switchMap(activities => this._storage.setData(StorageKey.ACTIVITIES, activities).pipe(
        map(() => ActivitiesApiActions.loadActivitiesSuccess({ activities }))
      )),
    ))
  ));

  addActivity$ = createEffect(() => this._actions$.pipe(
    ofType(ActivitiesActions.addActivity),
    withLatestFrom(this._store.select(activitiesSelector)),
    map(([{ activity }, activities]) => ({
      ...activity,
      id: Math.max(...activities.map(x => x.id), 0) + 1
    })),
    map(activity => ActivitiesApiActions.createActivity({ activity }))
  ));

  createActivityApi$ = createEffect(() => this._actions$.pipe(
    ofType(ActivitiesApiActions.createActivity),
    withLatestFrom(this._store.select(activitiesSelector)),
    switchMap(([{ activity }, activities]) => this._storage.setData(StorageKey.ACTIVITIES, activities).pipe(
      switchMap(() => this._activitiesService.createTestActivity(activity).pipe(
        map(() => ActivitiesApiActions.createActivitySuccess({ activity })),
      ))
    )),
  ));


  constructor(
    private readonly _actions$: Actions,
    private readonly _activitiesService: ActivitiesService,
    private readonly _storage: AppStorageService,
    private readonly _store: Store
  ) { }
}
