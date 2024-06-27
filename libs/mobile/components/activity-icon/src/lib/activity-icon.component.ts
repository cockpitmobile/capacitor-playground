import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { SvgCachePipe } from '@cockpit/mobile/svg-cache-pipe';

@Component({
  selector: 'cockpit-activity-icon',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, SvgCachePipe],
  templateUrl: './activity-icon.component.html',
  styleUrl: './activity-icon.component.scss',
})
export class ActivityIconComponent {
  svgSource = input<string>();
  height = input<string>();
  width = input<string>();
}
