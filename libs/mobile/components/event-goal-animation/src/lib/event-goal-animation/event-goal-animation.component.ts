import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RAAEvent } from '@cockpit/mobile/data-models';

@Component({
  selector: 'app-event-goal-animation',
  imports: [CommonModule],
  templateUrl: './event-goal-animation.component.html',
  styleUrl: './event-goal-animation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventGoalAnimationComponent {
  private readonly _domSanitizer = inject(DomSanitizer);

  public readonly eventInfo = input.required<RAAEvent>();
  public readonly goalPercentage = input.required<number>();

  animationSvg = computed<SafeHtml | undefined>(() => {
    const eventInfo = this.eventInfo();
    return eventInfo.animation_body && eventInfo.animation_function
      ? this._domSanitizer.bypassSecurityTrustHtml(eventInfo.animation_body)
      : undefined;
  });

  // eslint-disable-next-line @typescript-eslint/ban-types
  animationFunc = computed<Function | undefined>(() => {
    const eventInfo = this.eventInfo();

    return eventInfo.animation_function
      ? new Function('n', eventInfo.animation_function)
      : undefined;
  });

  backupImage = computed(() => {
    const eventInfo = this.eventInfo();

    return eventInfo.race_banner_image_link
      ? `${eventInfo.race_banner_image_link}?${new Date().getTime()}`
      : '';
  });

  private readonly _callAnimationFunction = effect(() => {
    const animation = this.animationFunc();
    const goalPercentage = this.goalPercentage();

    animation?.(goalPercentage);
  });
}
