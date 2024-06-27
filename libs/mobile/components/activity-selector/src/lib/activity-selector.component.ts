import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityType } from '@prisma/client';
import { MatDivider } from '@angular/material/divider';
import { ActivityIconComponent } from '@cockpit/mobile/components/activity-icon';

@Component({
  selector: 'cockpit-activity-selector',
  standalone: true,
  imports: [CommonModule, MatDivider, ActivityIconComponent],
  templateUrl: './activity-selector.component.html',
  styleUrl: './activity-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitySelectorComponent {
  featuredActivityTypes = input<ActivityType[]>([]);
  allActivityTypes = input<ActivityType[]>([]);

  @Output() activitySelected = new EventEmitter<ActivityType>();

  selectActivity(activity: ActivityType) {
    this.activitySelected.emit(activity);
  }
}
