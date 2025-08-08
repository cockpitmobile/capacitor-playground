import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RAAEvent } from '@cockpit/mobile/data-models';
import { UsersService } from '@cockpit/mobile-data-access-users';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { firstValueFrom } from 'rxjs';
import {
  getLongDate,
  getShortMonthOfYear,
  getTime,
  isSameMonth,
} from '@cockpit/mobile-utils-dates';
import { BadgesService } from '@cockpit/mobile-data-access-badges';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-user-activity-stats-page',
  imports: [CommonModule, Button, FormsModule, Checkbox],
  templateUrl: './user-activity-stats-page.component.html',
  styleUrl: './user-activity-stats-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityStatsPageComponent implements OnInit {
  private readonly userService = inject(UsersService);
  private readonly eventsService = inject(EventService);
  private readonly _badgeService = inject(BadgesService);

  public readonly isPreview = input<boolean>(false);
  public readonly unlockedBadges = this._badgeService.userUnlockedBadges;

  public readonly data = signal<any[]>([]);
  public month?: string;
  public year?: string;
  public topScale?: string;
  public midScale?: string;
  public isScaleLeft?: boolean;
  public selectedMonthIndex = -1;
  public totalData: {
    complete_time: Date;
    distance: number;
    minutes: number;
  }[] = [];
  public seasonSelectText?: string;
  public season: RAAEvent[] = [];
  public seasons: RAAEvent[] = [];
  public activitySelectText?: string;
  public activity: Array<any> = [];
  public completedActivityTypes: Array<any> = [];
  public graphDistance?: number;
  public graphActivities?: number;
  public graphActivityType?: string;
  public graphPace?: string;
  public graphTime?: string;
  public farthestSeason?: string;
  public farthestSeasonImage?: string;
  public longestStreak?: string;
  public longestStreakNumber?: number;
  public farthestActivity?: string;
  public farthestActivityType?: string;
  public lifetimeDistance?: number;
  public lifetimeTime?: number;
  public lifetimeTimeUnits?: string;
  public lifetimeSeasons?: number;
  public lifetimeBadgesEarned?: number;
  public showFilter?: boolean;
  public isMiles?: boolean;
  public hasScrolled?: boolean;

  async ngOnInit() {
    // TODO: ALL OF THIS
    this.isMiles = false; //this.mainUtil.isMiles;

    this.seasons = this.eventsService.events();
    this.season = [];
    this.changeSeasonSelect(true);
    this.lifetimeSeasons = this.seasons.length;

    await this.getUserStatsLifetime();
    const storage = localStorage.getItem('StatsActivityTypes');
    if (storage) {
      const activities = JSON.parse(storage);
      this.activity = [];
      activities.forEach((element: any) => {
        const found = this.completedActivityTypes.find(
          (x) => x.activityType === element.activityType
        );
        if (found) {
          this.activity.push(found);
        }
      });
    } else {
      this.activity = [];
      localStorage.setItem('StatsActivityTypes', JSON.stringify(this.activity));
    }
    this.changeActivitySelect(true);
    await this.getUserStatsSeasonActivityType();
  }

  async switchUnits() {
    this.isMiles = !this.isMiles;
    await this.getUserStatsLifetime();
    await this.getUserStatsSeasonActivityType();
  }

  isActivitySelected(activity: any) {
    return this.activity.findIndex((x) => x.name === activity.name) !== -1;
  }

  async toggleActivity(activity: any) {
    const index = this.activity.findIndex((x) => x.name === activity.name);
    if (index === -1) {
      this.activity.push(activity);
    } else {
      this.activity.splice(index, 1);
    }
    await this.changeActivitySelect();
  }

  async clearActivities() {
    this.activity = [];
    await this.changeActivitySelect();
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  isSeasonSelected(season: RAAEvent) {
    return this.season.findIndex((x) => x.id === season.id) !== -1;
  }

  async toggleSeason(season: RAAEvent) {
    const index = this.season.findIndex((x) => x.id === season.id);
    if (index === -1) {
      this.season.push(season);
    } else {
      this.season.splice(index, 1);
    }
    await this.changeSeasonSelect();
  }

  async clearSeasons() {
    this.season = [];
    await this.changeSeasonSelect();
  }

  async getUserStatsSeasonActivityType() {
    try {
      const result = await firstValueFrom(
        this.userService.getUserStatsSeasonActivityType(
          this.userService.currentUser()!.id,
          this.activity.length === 0
            ? this.completedActivityTypes.map((y) => y.activityType)
            : this.activity.map((y) => y.activityType),
          this.season.map((y) => y.id)
        )
      );
      this.totalData = result.monthly_data;
      this.initializeData(result.monthly_data);
      this.graphDistance =
        Math.floor(
          (this.isMiles ? result.total_distance_mi : result.total_distance_km) *
            10
        ) / 10;
      this.graphActivities = +result.activity_count;
      this.graphActivityType =
        this.graphActivities === 1 ? 'Activity' : 'Actvities';

      this.graphPace = getTime(
        (this.isMiles ? result.average_pace_mi : result.average_pace_km) *
          60 *
          1000,
        'Short'
      );
      if (result.total_minutes > 1439) {
        const days = Math.floor(result.total_minutes / 144) / 10;
        const minutes = result.total_minutes - 1440 * days;
        this.graphTime = `${days} ${days === 1 ? 'day' : 'days'} ${days > 0 ? '' : getTime(minutes * 60 * 1000)}`;
      } else {
        this.graphTime = getTime(result.total_minutes * 60 * 1000);
      }
    } catch (error) {
      // this.mainUtil.handleError(
      //   'An error occurred while loading activity stats. Please try again.'
      // );
    }
  }

  async getUserStatsLifetime() {
    try {
      const result = await firstValueFrom(
        this.userService.getUserStatsLifetime(
          this.userService.currentUser()!.id
        )
      );
      this.completedActivityTypes = this.getAllCompletedActivityTypes(
        result.activities
      );
      if (result.farthest_season) {
        this.farthestSeason = this.isMiles
          ? `${Math.floor(result.farthest_season.sum * 0.621371 * 10) / 10}mi • ${result.farthest_season.title}`
          : `${Math.floor(result.farthest_season.sum * 10) / 10}km • ${result.farthest_season.title}`;
        this.farthestSeasonImage = result.farthest_season.event_badge_logo
          ? result.farthest_season.event_badge_logo.link
          : null;
      } else {
        this.farthestSeason = 'No seasons completed';
        this.farthestSeasonImage = undefined;
      }
      if (result.longest_streak) {
        const date = new Date(result.longest_streak.completed_date);
        date.setDate(date.getDate() + 1);
        this.longestStreak = `${result.longest_streak.streak} day${result.longest_streak.streak === 1 ? '' : 's'} • ${getLongDate(date)}`;
        this.longestStreakNumber = result.longest_streak.streak;
      } else {
        this.longestStreak = 'No activities completed';
        this.longestStreakNumber = 0;
      }
      // TODO: Uncomment when farthest activity is available
      // if (result.farthest_activity) {
      //   const farthestActivitySeason = (
      //     await this.projectService
      //       .getProjectById(result.farthest_activity.project_id)
      //       .toPromise()
      //   )[0];
      //   this.farthestActivity = this.isMiles
      //     ? `${Math.floor(result.farthest_activity.distance_ran_miles * 10) / 10}mi • ${result.farthest_season.title}`
      //     : `${Math.floor(result.farthest_activity.distance_ran_km * 10) / 10}km ${farthestActivitySeason ? '• ' + farthestActivitySeason.title : ''}`;
      //   this.farthestActivityType = result.farthest_activity.activity_type;
      // } else {
      //   this.farthestActivity = 'No activities completed';
      //   this.farthestActivityType = 'walk';
      // }
      this.lifetimeDistance = this.isMiles
        ? Math.floor(result.total_distance_km * 0.621371)
        : Math.floor(result.total_distance_km);
      if (result.total_minutes > 59) {
        this.lifetimeTime = Math.floor(result.total_minutes / 60);
        this.lifetimeTimeUnits = `hour${this.lifetimeTime === 1 ? '' : 's'}`;
      } else {
        this.lifetimeTime = result.total_minutes;
        this.lifetimeTimeUnits = `min`;
      }
      this.lifetimeSeasons = this.seasons.length;
      this.lifetimeBadgesEarned = this.unlockedBadges().length;
    } catch (error) {
      // this.mainUtil.handleError(
      //   'An error occurred while loading activity stats. Please try again.'
      // );
    }
  }

  checkScroll() {
    const graphDiv = document.getElementById('graphDiv');
    const top = graphDiv!.getBoundingClientRect().top;

    if (!this.hasScrolled && top < 50) {
      this.hasScrolled = true;
    }
  }

  async changeSeasonSelect(init = false) {
    if (this.season.length === 0) {
      this.seasonSelectText = 'Select season';
    } else if (this.season.length === 1) {
      this.seasonSelectText =
        this.season[0].config && this.season[0].config.race_animation_name
          ? this.season[0].config.race_animation_name
          : this.season[0].title;
    } else if (this.season.length === this.seasons.length) {
      this.seasonSelectText = `All seasons`;
    } else {
      this.seasonSelectText = `${this.season.length} seasons`;
    }
    if (!init) {
      await this.getUserStatsSeasonActivityType();
    }
  }

  async changeActivitySelect(init = false) {
    if (this.activity.length === 0) {
      this.activitySelectText = 'Select activity';
    } else if (this.activity.length === 1) {
      this.activitySelectText = this.activity[0].name;
    } else if (this.activity.length === this.completedActivityTypes.length) {
      this.activitySelectText = `All activities`;
    } else {
      this.activitySelectText = `${this.activity.length} activities`;
    }
    if (!init) {
      await this.getUserStatsSeasonActivityType();
    }
    localStorage.setItem('StatsActivityTypes', JSON.stringify(this.activity));
  }

  getAllCompletedActivityTypes(activities: any) {
    const allActivityTypes: any[] = [];
    for (let i = 0; i < activities.length; ++i) {
      // if (
      //   UIConstants.activityTypes.some(
      //     (item) => item['value'] === activities[i]
      //   )
      // ) {
      //   allActivityTypes.push({
      //     name:
      //       activities[i].charAt(0).toUpperCase(0) + activities[i].substring(1),
      //     activityType: activities[i],
      //     isSelected: false,
      //     data: null,
      //   });
      // }
    }

    return allActivityTypes;
  }

  initializeData(
    dataIn: Array<{ complete_time: Date; distance: number; minutes: number }>
  ) {
    this.data.set([]);
    let today = new Date();
    today.setDate(15);
    const datePipe = new DatePipe('en-US');
    this.month = datePipe.transform(new Date(today), 'MMMM') as string;
    this.year = datePipe.transform(new Date(today), 'yyyy') as string;
    let largest;

    const data: any[] = [...dataIn];

    for (let i = 0; i < (this.isPreview() ? 6 : 12); i++) {
      let timeSpanData:
        | {
            complete_time: Date;
            distance: number;
            minutes: number;
          }
        | undefined = undefined;
      for (let j = 0; j < data.length; j++) {
        const element = data[j];
        const month = new Date(element.complete_time);
        month.setDate(month.getDate() + 1);
        if (isSameMonth(today, month)) {
          timeSpanData = element;
          break;
        }
      }
      const hours = timeSpanData ? Math.floor(timeSpanData.minutes / 60) : 0;
      const minutes = timeSpanData
        ? Math.round(timeSpanData.minutes - hours * 60)
        : 0;
      const entry = {
        date: today,
        monthString: getShortMonthOfYear(today),
        distance: timeSpanData
          ? Math.round(
              timeSpanData.distance * 10 * (this.isMiles ? 1 : 1.60934)
            ) / 10
          : 0,
        time: `${hours}h ${minutes}m`,
        percent: '0%',
      };
      if (entry && (!largest || largest.value < entry.distance)) {
        largest = {
          index: i,
          value: entry.distance,
        };
      }
      data.push(entry);
      today = new Date(today);
      today.setMonth(today.getMonth() - 1);
    }

    if (!largest) {
      largest = {
        index: -1,
        value: 1,
      };
    }

    data.forEach((element: any) => {
      const percent = Math.round(
        (element.distance / (Math.round(largest.value * 10) / 10)) * 98
      );
      element.percent = `${percent + 2}%`;
    });

    this.topScale = `${Math.ceil(largest.value)}${this.isMiles ? 'Mi' : 'Km'}`;
    this.midScale = `${Math.ceil(largest.value / 2)}${this.isMiles ? 'Mi' : 'Km'}`;
    this.isScaleLeft = largest.index === 0 || largest.index === 1;
    data.sort((a: any, b: any) =>
      new Date(a.date) > new Date(b.date) ? 1 : -1
    );

    this.data.set(data);
  }

  selectMonth(index: number) {
    if (this.selectedMonthIndex === index) {
      this.selectedMonthIndex = -1;
    } else {
      this.selectedMonthIndex = index;
      const datePipe = new DatePipe('en-US');
      this.month = datePipe.transform(
        new Date(this.data()[index].date),
        'MMMM'
      ) as string;
      this.year = datePipe.transform(
        new Date(this.data()[index].date),
        'yyyy'
      ) as string;
    }
  }

  getOpacityColor() {
    return `rgba(0, 0, 0, ${this.hasScrolled ? '0.5' : '0.1'})`;
  }
}
