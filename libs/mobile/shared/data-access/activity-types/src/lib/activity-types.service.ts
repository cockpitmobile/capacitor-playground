import { inject, Injectable } from '@angular/core';
import { HttpService } from '@cockpit/mobile/http';
import { ActivityType } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityTypesService {
  private readonly _http = inject(HttpService);

  getAll(): Observable<ActivityType[]> {
    return this._http.get<ActivityType[]>('/activity-types');
  }
}
