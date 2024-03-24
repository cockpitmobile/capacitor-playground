import { Injectable } from '@angular/core';
import { TestActivity } from '@cockpit/data-models';
import { AppStorageService, StorageKey } from '@cockpit/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private _allActivities$$ = new BehaviorSubject<TestActivity[]>([]);
  public allActivities$ = this._allActivities$$.asObservable();

  constructor(
    private readonly storage: AppStorageService
  ) { }

  createTestActivity(activity: TestActivity) {
    let activities = this._allActivities$$.value;
    activities = [activity, ...activities];
    this._allActivities$$.next(activities);

    this.storage.setData(StorageKey.ACTIVITIES, activities);
  }

  async loadActivities(): Promise<void> {
    const activities = await this.storage.getData<TestActivity[]>(StorageKey.ACTIVITIES);
    if (activities) {
      this._allActivities$$.next(activities);
    }
  }
}
