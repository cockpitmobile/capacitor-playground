import { Injectable } from '@angular/core';
import { TestActivity } from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { from, map, Observable, switchMap } from 'rxjs';
import { HttpService } from '@cockpit/mobile/http';
import { StorageKey } from '@cockpit/mobile/constants';
import { HttpParams } from '@angular/common/http';
import { addCachedActivities } from './activities.util';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  constructor(
    private readonly storage: AppStorageService,
    private readonly _http: HttpService
  ) {}

  createTestActivity(activity: TestActivity): Observable<TestActivity> {
    // queue up the http request to create this activity (in case of being offline)
    return this._http.postWithSync<TestActivity>(
      `/activities`,
      activity,
      new HttpParams()
    );
  }

  getActivitesFromAPI(): Observable<TestActivity[]> {
    return this._http
      .get<TestActivity[]>(`/activities`)
      .pipe(
        switchMap((activities) =>
          from(
            this.storage.getData<TestActivity[]>(StorageKey.ACTIVITIES)
          ).pipe(
            map((storedActivities) =>
              addCachedActivities(activities, storedActivities)
            )
          )
        )
      );
  }
}
