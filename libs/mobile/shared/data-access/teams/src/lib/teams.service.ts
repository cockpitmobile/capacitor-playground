import { Injectable, signal } from '@angular/core';
import {
  FeaturedRaceTeamApiResponse,
  RaceTeam,
  UserRaceTeam,
  UserRaceTeamsAPIResponse,
} from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { Observable, tap } from 'rxjs';
import { HttpService } from '@cockpit/mobile/http';

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
    return this._http
      .get<UserRaceTeamsAPIResponse>(`/users/${userId}/raceteams`)
      .pipe(tap((data) => this.userTeams.set(data.race_teams)));
  }

  search(searchTerm: string): Observable<{
    team: RaceTeam;
    memberCount: number;
  }> {
    return this._http.post(`/searchraceteams`, { search: searchTerm });
  }

  getFeatured(): Observable<FeaturedRaceTeamApiResponse[]> {
    return this._http
      .get<FeaturedRaceTeamApiResponse[]>(`/raceteams?is_featured=t`)
      .pipe(
        tap((data: FeaturedRaceTeamApiResponse[]) =>
          this.featuredTeams.set(data)
        )
      );
  }
}
