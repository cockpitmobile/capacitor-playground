import { Injectable, signal } from '@angular/core';
import {
  FeaturedRaceTeamApiResponse,
  RaceTeam,
  UserRaceTeam,
  UserRaceTeamsAPIResponse,
} from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { Observable, switchMap, tap } from 'rxjs';
import { HttpService } from '@cockpit/mobile/http';
import { StorageKey } from '@cockpit/mobile/constants';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  constructor(
    private readonly storage: AppStorageService,
    private readonly _http: HttpService
  ) {}

  public readonly userTeams = signal<UserRaceTeam[]>([]);
  public readonly featuredTeams = signal<FeaturedRaceTeamApiResponse[]>([]);

  getForUser(userId: string): Observable<UserRaceTeamsAPIResponse> {
    return this.storage
      .getData<UserRaceTeamsAPIResponse>(StorageKey.USER_TEAMS)
      .pipe(
        tap((teams) => {
          if (teams) {
            this.userTeams.set(teams.race_teams);
          }
        }),
        switchMap(() =>
          this._http
            .get<UserRaceTeamsAPIResponse>(`/users/${userId}/raceteams`)
            .pipe(
              tap((data) => this.userTeams.set(data.race_teams)),
              tap((data) => this.storage.setData(StorageKey.USER_TEAMS, data))
            )
        )
      );
  }

  search(searchTerm: string): Observable<{
    team: RaceTeam;
    memberCount: number;
  }> {
    return this._http.post(`/searchraceteams`, { search: searchTerm });
  }

  getFeatured(): Observable<FeaturedRaceTeamApiResponse[]> {
    return this.storage
      .getData<FeaturedRaceTeamApiResponse[]>(StorageKey.FEATURED_TEAMS)
      .pipe(
        tap((data) => {
          if (data) {
            this.featuredTeams.set(data);
          }
        }),
        switchMap(() =>
          this._http
            .get<FeaturedRaceTeamApiResponse[]>(`/raceteams?is_featured=t`)
            .pipe(
              tap((data: FeaturedRaceTeamApiResponse[]) =>
                this.featuredTeams.set(data)
              ),
              tap((data: FeaturedRaceTeamApiResponse[]) => {
                this.storage.setData(StorageKey.FEATURED_TEAMS, data);
              })
            )
        )
      );
  }
}
