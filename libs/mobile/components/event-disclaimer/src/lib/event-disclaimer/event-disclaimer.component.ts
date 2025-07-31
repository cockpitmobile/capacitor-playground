import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RAAEvent } from '@cockpit/mobile/data-models';

@Component({
  selector: 'app-event-disclaimer',
  imports: [CommonModule],
  templateUrl: './event-disclaimer.component.html',
  styleUrl: './event-disclaimer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDisclaimerComponent {
  public readonly eventInfo = input.required<RAAEvent>();
  protected readonly event = event;
}
