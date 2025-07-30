import { Injectable, signal } from '@angular/core';
import { RAAEvent } from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { Observable, tap } from 'rxjs';
import { HttpService } from '@cockpit/mobile/http';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private readonly storage: AppStorageService,
    private readonly _http: HttpService
  ) {}

  public readonly events = signal<RAAEvent[]>([]);

  getAll(): Observable<RAAEvent[]> {
    return this._http
      .get<RAAEvent[]>(`/projects`)
      .pipe(
        tap((data) =>
          this.events.set(
            data.filter((event) => !!event.next_season_project_id)
          )
        )
      );
  }
}
