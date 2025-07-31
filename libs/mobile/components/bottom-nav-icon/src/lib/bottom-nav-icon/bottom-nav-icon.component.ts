import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-nav-icon',
  imports: [CommonModule],
  templateUrl: './bottom-nav-icon.component.html',
  styleUrl: './bottom-nav-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavIconComponent {
  public readonly type = input.required<string>();
  public readonly color = input('var(--primary-color)');
}
