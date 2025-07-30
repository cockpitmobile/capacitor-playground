import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { EventGoalAnimationComponent } from '@cockpit/event-goal-animation';
import { EventChallengesComponent } from '@cockpit/event-challenges';
import { ChallengesService } from '@cockpit/mobile-data-access-challenges';

@Component({
  selector: 'lib-current-event-page',
  imports: [
    CommonModule,
    EventGoalAnimationComponent,
    EventChallengesComponent,
  ],
  templateUrl: './current-event-page.component.html',
  styleUrl: './current-event-page.component.scss',
})
export class CurrentEventPageComponent implements OnInit {
  private readonly _eventService = inject(EventService);
  private readonly _challengesService = inject(ChallengesService);

  public readonly currentGoalPercentage = signal<number>(0.0);

  public readonly currentEvent = this._eventService.currentEvent;
  public readonly challenges = this._challengesService.challenges;

  public readonly currentChallenges = computed(() => {
    const currentEvent = this.currentEvent();
    const challenges = this.challenges();

    const filtered = challenges.filter(
      (challenge) => challenge.project_id === currentEvent?.id
    );

    console.log(filtered);
    return filtered;
  });

  ngOnInit() {
    // TODO: REMOVE

    setInterval(
      () => this.currentGoalPercentage.update((x) => (x += 0.1)),
      2000
    );
  }
}
