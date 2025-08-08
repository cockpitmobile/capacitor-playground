import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-page',
  imports: [CommonModule],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfilePageComponent {}
