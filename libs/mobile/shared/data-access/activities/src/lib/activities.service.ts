import { Injectable } from '@angular/core';
import { TestActivity } from '@cockpit/data-models';
import { AppStorageService } from '@cockpit/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  public allActivities$: Observable<TestActivity[]> = this.storage.testActivities$;

  constructor(
    private readonly storage: AppStorageService
  ) { }

  createTestActivity(activity: TestActivity): TestActivity {
    return this.storage.createTestActivity(activity);
  }
}
