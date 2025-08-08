import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '@cockpit/mobile/http';
import { User } from '@cockpit/mobile/data-models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _http = inject(HttpService);

  public readonly currentUser = signal<User | undefined>(undefined);

  getUserByEmailAddress(email: string): Observable<User[]> {
    return this._http.get<User[]>(`/users?email=${email}`);
  }

  sendResetAccessCodeEmail(email: string): Observable<boolean> {
    return this._http.post<{ email: string }, boolean>(
      `/users/access-code/reset`,
      { email }
    );
  }

  setUser(user: User): void {
    this.currentUser.set(user);
  }

  updateUser(user: User): Observable<User> {
    return this._http.put<User>(`/users/${user.id}`, user).pipe(
      tap((updatedUser) => {
        this.currentUser.set(updatedUser);
      })
    );
  }

  getUserStatsSeasonActivityType(
    userId: string,
    activityTypes: string[],
    projectIds: string[] = []
  ): Observable<{
    total_distance_mi: number;
    total_distance_km: number;
    activity_count: number;
    total_minutes: number;
    average_pace_mi: number;
    average_pace_km: number;
    monthly_data: {
      complete_time: Date;
      distance: number;
      minutes: number;
    }[];
  }> {
    return this._http.post(`/users/${userId}/stats/seasonactivitytype`, {
      activity_types: activityTypes,
      project_ids: projectIds,
    });
  }

  getUserStatsLifetime(userId: string): Observable<{
    total_distance_mi: number;
    total_distance_km: number;
    total_minutes: number;
    longest_streak: any;
    farthest_activity: any;
    farthest_season: any;
    activities: string[];
  }> {
    return this._http.post(`/users/${userId}/stats/lifetime`, {});
  }
}
