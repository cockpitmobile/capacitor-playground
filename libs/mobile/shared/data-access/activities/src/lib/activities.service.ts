import { Injectable, signal } from '@angular/core';
import { Activity, TestActivity } from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { from, map, Observable, switchMap, tap } from 'rxjs';
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

  public readonly userActivities = signal<Activity[]>([]);

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

  getAllForUser(userId: string): Observable<Activity[]> {
    return this._http
      .get<Activity[]>(`/eventresults?user_id=${userId}`)
      .pipe(tap((data) => this.userActivities.set(data)));
  }
}
