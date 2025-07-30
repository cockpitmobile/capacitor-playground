import { Injectable, signal } from '@angular/core';
import { Challenge } from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { Observable, tap } from 'rxjs';
import { HttpService } from '@cockpit/mobile/http';

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
    return this._http
      .get<Challenge[]>(`/challenges`)
      .pipe(tap((data) => this.challenges.set(data)));
  }
}
