import { Injectable, signal } from '@angular/core';
import {
  Badge,
  BadgeGroup,
  ProjectBadge,
  RAAEvent,
  UserUnlockedBadge,
} from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { Observable, switchMap, tap } from 'rxjs';
import { HttpService } from '@cockpit/mobile/http';
import { StorageKey } from '@cockpit/mobile/constants';

@Injectable({
  providedIn: 'root',
})
export class BadgesService {
  constructor(
    private readonly storage: AppStorageService,
    private readonly _http: HttpService
  ) {}

  public readonly badges = signal<Badge[]>([]);
  public readonly projectBadges = signal<ProjectBadge[]>([]);
  public readonly userUnlockedBadges = signal<UserUnlockedBadge[]>([]);
  public readonly badgeGroups = signal<BadgeGroup[]>([]);

  getAll(): Observable<Badge[]> {
    return this.storage.getData<Badge[]>(StorageKey.BADGES).pipe(
      tap((data) => {
        if (data) {
          this.badges.set(data);
        }
      }),
      switchMap(() =>
        this._http.get<Badge[]>(`/badges`).pipe(
          tap((data) => {
            this.badges.set(data);
            this.storage.setData(StorageKey.BADGES, data);
          })
        )
      )
    );
  }

  getAllProjectBadges(): Observable<ProjectBadge[]> {
    return this.storage.getData<ProjectBadge[]>(StorageKey.PROJECT_BADGES).pipe(
      tap((data) => {
        if (data) {
          this.projectBadges.set(data);
        }
      }),
      switchMap(() =>
        this._http.get<ProjectBadge[]>(`/projectbadges`).pipe(
          tap((data) => {
            this.projectBadges.set(data);
            this.storage.setData(StorageKey.PROJECT_BADGES, data);
          })
        )
      )
    );
  }

  getUnlockedBadgesForUser(userId: string): Observable<UserUnlockedBadge[]> {
    return this.storage
      .getData<UserUnlockedBadge[]>(StorageKey.USER_UNLOCKED_BADGES)
      .pipe(
        tap((data) => {
          if (data) {
            this.userUnlockedBadges.set(data);
          }
        }),
        switchMap(() =>
          this._http
            .get<UserUnlockedBadge[]>(`/users/${userId}/unlockedbadges`)
            .pipe(
              tap((data) => {
                this.userUnlockedBadges.set(data);
                this.storage.setData(StorageKey.USER_UNLOCKED_BADGES, data);
              })
            )
        )
      );
  }

  getAllBadgeGroups(): Observable<BadgeGroup[]> {
    return this.storage.getData<BadgeGroup[]>(StorageKey.BADGE_GROUPS).pipe(
      tap((data) => {
        if (data) {
          this.badgeGroups.set(data);
        }
      }),
      switchMap(() =>
        this._http.get<BadgeGroup[]>(`/badgegroups`).pipe(
          tap((data) => {
            this.badgeGroups.set(data);
            this.storage.setData(StorageKey.BADGE_GROUPS, data);
          })
        )
      )
    );
  }

  getSeasonsWithBadges(
    userId: string
  ): Observable<{ projects_with_all_badges: RAAEvent[] }> {
    return this._http.get<{ projects_with_all_badges: RAAEvent[] }>(
      `/users/${userId}/allseasonswithbadges`
    );
  }

  getAllBadgeGroupsAndLifetimeBadges(userId: string): Observable<{
    badge_groups_with_lifetime_badges: {
      badge_groups: any;
      lifetime_badges_with_no_group: any;
    };
  }> {
    return this._http.get(`/users/${userId}/lifetimebadges`);
  }
}
