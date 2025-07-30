import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Challenge } from '@cockpit/mobile/data-models';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-event-challenges',
  imports: [CommonModule, Button],
  templateUrl: './event-challenges.component.html',
  styleUrl: './event-challenges.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventChallengesComponent {
  public readonly challenges = input.required<Challenge[]>();
}
