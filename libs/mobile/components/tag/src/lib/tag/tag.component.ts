import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaceTeam } from '@cockpit/mobile/data-models';

@Component({
  selector: 'app-tag',
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  public readonly team = input.required<RaceTeam>();
  public readonly textColor = input<string>();
  public readonly accentColor = input<string>();
  public readonly marginLeft = input<string>();
  public readonly invertedColor = input<boolean>(false);
}
