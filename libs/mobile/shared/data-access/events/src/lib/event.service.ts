import { computed, Injectable, signal } from '@angular/core';
import { RAAEvent } from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { Observable, tap } from 'rxjs';
import { HttpService } from '@cockpit/mobile/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private readonly storage: AppStorageService,
    private readonly _http: HttpService,
    private readonly _router: Router
  ) {}

  public readonly currentEventId = signal<string | undefined>(undefined);
  public readonly events = signal<RAAEvent[]>([]);

  public readonly currentEvent = computed(() => {
    const eventId = this.currentEventId();
    const events = this.events();

    return events.find((event) => event.id === eventId) || null;
  });

  getAll(): Observable<RAAEvent[]> {
    return this._http
      .get<RAAEvent[]>(`/projects`)
      .pipe(
        tap((data) =>
          this.events.set(
            data
              .filter(
                (event) =>
                  !!event.cohort_data?.length && !!event.event_badge_logo?.link
              )
              .sort((a, b) => a.title.localeCompare(b.title))
          )
        )
      );
  }

  selectEvent(event: RAAEvent): void {
    this.currentEventId.set(event.id);
    this._router.navigate(['user', 'current-event']);
  }
}
