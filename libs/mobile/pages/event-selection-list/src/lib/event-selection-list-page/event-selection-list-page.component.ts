import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { CardModule } from 'primeng/card';
import { RAAEvent } from '@cockpit/mobile/data-models';
import { ChallengesService } from '@cockpit/mobile-data-access-challenges';
import { ActivitiesService } from '@cockpit/mobile/activities';
import { UsersService } from '@cockpit/mobile-data-access-users';
import { BadgesService } from '@cockpit/mobile-data-access-badges';

@Component({
  selector: 'lib-event-selection-list-page',
  imports: [CommonModule, CardModule],
  templateUrl: './event-selection-list-page.component.html',
  styleUrl: './event-selection-list-page.component.scss',
})
export class EventSelectionListPageComponent implements OnInit {
  private readonly _eventService = inject(EventService);
  private readonly _challengesService = inject(ChallengesService);
  private readonly _activitiesService = inject(ActivitiesService);
  private readonly _userService = inject(UsersService);
  private readonly _badgeService = inject(BadgesService);

  public readonly events = this._eventService.events;
  public readonly currentUser = this._userService.currentUser;

  ngOnInit() {
    // TODO: Move these somewhere else that makes sense
    this._eventService.getAll().subscribe();
    this._challengesService.getAll().subscribe();
    this._badgeService.getAll().subscribe();
    this._badgeService.getAllProjectBadges().subscribe();
    this._badgeService.getAllBadgeGroups().subscribe();
    const user = this._userService.currentUser();
    if (user) {
      this._activitiesService.getAllForUser(user.id).subscribe();
      this._badgeService.getUnlockedBadgesForUser(user.id).subscribe();
    }
  }

  selectEvent(event: RAAEvent) {
    this._eventService.selectEvent(event);
  }
}
