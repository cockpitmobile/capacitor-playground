import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsService } from '@cockpit/mobile-data-access-teams';
import { TagComponent } from '@cockpit/tag';
import { Button } from 'primeng/button';
import { UsersService } from '@cockpit/mobile-data-access-users';

@Component({
  selector: 'app-user-teams-page',
  imports: [CommonModule, TagComponent, Button],
  templateUrl: './user-teams-page.component.html',
  styleUrl: './user-teams-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTeamsPageComponent implements OnInit {
  private readonly _teamsService = inject(TeamsService);
  private readonly _userService = inject(UsersService);

  public readonly userTeams = this._teamsService.userTeams;
  public readonly featuredTeams = this._teamsService.featuredTeams;
  public readonly currentUser = this._userService.currentUser;

  ngOnInit() {
    const user = this._userService.currentUser();
    if (user) {
      this._teamsService.getForUser(user.id).subscribe();
    }
    this._teamsService.getFeatured().subscribe();
  }
}
