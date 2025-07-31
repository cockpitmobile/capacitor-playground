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

@Component({
  selector: 'app-user-teams-page',
  imports: [CommonModule, TagComponent, Button],
  templateUrl: './user-teams-page.component.html',
  styleUrl: './user-teams-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTeamsPageComponent implements OnInit {
  private readonly _teamsService = inject(TeamsService);

  public readonly userTeams = this._teamsService.userTeams;
  public readonly featuredTeams = this._teamsService.featuredTeams;

  ngOnInit() {
    this._teamsService
      .getForUser('0d44cba2-91f7-40f1-8107-353413e44b3d')
      .subscribe();
    this._teamsService.getFeatured().subscribe();
  }
}
