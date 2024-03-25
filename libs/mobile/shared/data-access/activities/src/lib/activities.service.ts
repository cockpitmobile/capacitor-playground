import { Injectable } from '@angular/core';
import { TestActivity } from '@cockpit/data-models';
import { AppStorageService } from '@cockpit/storage';
import { BehaviorSubject, from, map, switchMap } from 'rxjs';
import { HttpService } from '@cockpit/http';
import { StorageKey } from '@cockpit/constants';
import { HttpParams } from '@angular/common/http';
import { addCachedActivities } from './activities.util';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private _allActivities$$ = new BehaviorSubject<TestActivity[]>([]);
  public allActivities$ = this._allActivities$$.asObservable();

  constructor(
    private readonly storage: AppStorageService,
    private readonly _http: HttpService
  ) { }

  createTestActivity(activity: TestActivity) {
    let activities = this._allActivities$$.value;
    activities = [activity, ...activities];
    this._allActivities$$.next(activities);

    this.storage.setData(StorageKey.ACTIVITIES, activities);

    // queue up the http request to create this activity (in case of being offline)
    this._http.postWithSync(`/activities`, activity, new HttpParams()).subscribe();
  }

  async loadActivities(): Promise<void> {
    const activities = await this.storage.getData<TestActivity[]>(StorageKey.ACTIVITIES);
    if (activities) {
      this._allActivities$$.next(activities);
    }

    this._http.get<TestActivity[]>(`/activities`).pipe(
      switchMap(activities => from(this.storage.getData<TestActivity[]>(StorageKey.ACTIVITIES)).pipe(
        map(storedActivities => addCachedActivities(activities, storedActivities))
      ))
    ).subscribe(activities => {
      this._allActivities$$.next(activities);
    });
  }
}
