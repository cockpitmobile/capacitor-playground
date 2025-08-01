import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { BadgesService } from '@cockpit/mobile-data-access-badges';
import { UserBadgeSectionComponent } from '../user-badge-section/user-badge-section.component';
import { UsersService } from '@cockpit/mobile-data-access-users';
import { ProjectParticipant, RAAEvent } from '@cockpit/mobile/data-models';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-user-badges',
  imports: [CommonModule, UserBadgeSectionComponent],
  templateUrl: './user-badges-page.component.html',
  styleUrl: './user-badges-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBadgesPageComponent implements OnInit {
  private readonly _badgeService = inject(BadgesService);
  private readonly _eventsService = inject(EventService);
  private readonly _userService = inject(UsersService);

  public readonly events = signal<RAAEvent[]>([]);
  public readonly lifetimeBadges = signal<any[]>([]);
  public readonly badgeGroups = signal<any[]>([]);

  public readonly currentUser = this._userService.currentUser;

  public readonly selectedTab = signal(0);

  ngOnInit() {
    const currentUser = this.currentUser();
    if (currentUser) {
      this._badgeService
        .getSeasonsWithBadges(currentUser.id)
        .pipe(
          tap((result) => {
            this.events.set(result.projects_with_all_badges);
            this.events.update((events) =>
              events.map((element) => ({
                ...element,
                ProjectParticipant: {
                  cohort_start_date: element.start_date,
                  cohort_end_date: element.estimated_end_time,
                } as ProjectParticipant,
              }))
            );
            // const project = this.userService.currentUser.worker_projects.find(
            //   (x) => x.id === element.id
            // );
            // if (
            //   project &&
            //   project.ProjectParticipant &&
            //   project.ProjectParticipant.cohort_start_date
            // ) {
            //   element.ProjectParticipant = project.ProjectParticipant;
            // } else {
            //
            // }
            this.events.update((events) => [
              ...events.sort((a: RAAEvent, b: RAAEvent) => {
                return new Date(
                  (a.ProjectParticipant?.cohort_start_date
                    ? a.ProjectParticipant.cohort_start_date
                    : a.start_date) || ''
                ) <
                  new Date(
                    (b.ProjectParticipant?.cohort_start_date
                      ? b.ProjectParticipant.cohort_start_date
                      : b.start_date) || ''
                  )
                  ? 1
                  : -1;
              }),
            ]);
          }),
          switchMap(() =>
            this._badgeService
              .getAllBadgeGroupsAndLifetimeBadges(currentUser.id)
              .pipe(
                tap((badges) => {
                  if (badges) {
                    this.lifetimeBadges.set(
                      badges.badge_groups_with_lifetime_badges.lifetime_badges_with_no_group.filter(
                        (x: any) => x.badge_type !== 'seasonal'
                      )
                    );
                    this.badgeGroups.set(
                      badges.badge_groups_with_lifetime_badges.badge_groups.filter(
                        (x: any) => x.badges[0].badge_type !== 'seasonal'
                      )
                    );

                    this.badgeGroups.update((badgeGroups) => [
                      ...badgeGroups.sort((a, b) => {
                        return a.badge_group_order > b.badge_group_order
                          ? 1
                          : -1;
                      }),
                    ]);

                    this.badgeGroups.update((badgeGroups) =>
                      badgeGroups.map((group) => ({
                        ...group,
                        badges: [
                          ...group.badges.sort((a: any, b: any) => {
                            return a.badge_order > b.badge_order ? 1 : -1;
                          }),
                        ],
                      }))
                    );
                  }
                })
              )
          )
        )
        .subscribe();
    }
  }

  // hasDailyDistanceSeason() {
  //   return this.seasons && this.seasons.findIndex(x => !x.config.hide_badge_progress) !== -1;
  // }

  changeTab(index: number) {
    this.selectedTab.set(index);
  }
}
