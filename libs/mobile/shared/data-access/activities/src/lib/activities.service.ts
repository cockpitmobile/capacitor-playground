import { Injectable } from '@angular/core';
import { TestActivity } from '@cockpit/data-models';
import { AppStorageService, StorageKey } from '@cockpit/storage';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '@cockpit/http';

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
    this._http.post(`/activities`, activity).subscribe();
  }

  async loadActivities(): Promise<void> {
    const activities = await this.storage.getData<TestActivity[]>(StorageKey.ACTIVITIES);
    if (activities) {
      this._allActivities$$.next(activities);
    }

    this._http.get<TestActivity[]>(`/activities`).subscribe(activities => {
      this._allActivities$$.next(activities);
      this.storage.setData(StorageKey.ACTIVITIES, activities);
    });
  }
}
