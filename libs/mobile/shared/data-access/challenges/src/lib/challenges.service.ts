import { Injectable, signal } from '@angular/core';
import { Challenge } from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { HttpService } from '@cockpit/mobile/http';
import { StorageKey } from '@cockpit/mobile/constants';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  constructor(
    private readonly storage: AppStorageService,
    private readonly _http: HttpService
  ) {}

  public readonly challenges = signal<Challenge[]>([]);

  getAll(): Observable<Challenge[]> {
    return this.storage.getData<Challenge[]>(StorageKey.CHALLENGES).pipe(
      tap((data) => {
        if (data) {
          this.challenges.set(data);
        }
      }),
      switchMap(() =>
        this._http.get<Challenge[]>(`/challenges`).pipe(
          tap((data) => {
            this.challenges.set(data);
            this.storage.setData(StorageKey.CHALLENGES, data);
          })
        )
      )
    );
  }
}
