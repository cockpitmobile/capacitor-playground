import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Badge, BadgeGroup, RAAEvent } from '@cockpit/mobile/data-models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-badge-section',
  imports: [CommonModule],
  templateUrl: './user-badge-section.component.html',
  styleUrl: './user-badge-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBadgeSectionComponent {
  public readonly primaryColor = input.required<string>();
  public readonly badgeSection = input.required<Badge | BadgeGroup>();
  public readonly event = input<RAAEvent>();

  openBadge(selectedGroupBadge: any, currentGroupBadge: Badge | null = null) {
    // TODO:
    // const badgeSrc = await this.userService
    //   .getImageBase64(selectedGroupBadge.image_link)
    //   .pipe(timeout(30000))
    //   .toPromise()
    //   .catch((error) => {
    //     this.mainUtil.handleError(error);
    //   });
    // TODO:
    // if (badgeSrc) {
    //   this.dialog.open(BadgeDialogComponent, {
    //     data: {
    //       badge: selectedGroupBadge,
    //       badgeSrc: badgeSrc.image,
    //       profilePreview: false,
    //       isCurrentUser:
    //         this.getBadgeBrightness(currentGroupBadge, selectedGroupBadge) ===
    //         'brightness(100%)',
    //     },
    //     disableClose: true,
    //     minWidth: this.mainUtil.isMobile ? '98%' : '30rem',
    //     maxWidth: this.mainUtil.isMobile ? '98%' : '40rem',
    //     panelClass: 'myapp-no-padding-dialog',
    //     autoFocus: false,
    //   });
    //   this.mainUtil.sendGoogleAnalyticsEvent(`BadgeProgress_ViewBadge`);
    // } else {
    //   this.mainUtil.showSnackbar('Error loading badge.', 2000);
    // }
  }

  selectProgressBadge(item: any) {
    if (!item.badge_group_type) {
      return item;
    }
    if (
      !item.name ||
      !item.badges ||
      !item.badges[0] ||
      !item.badge_group_type
    ) {
      return null;
    }
    item.badges[0].progress = item.progress;
    let highestProgress = this.getProgressPercent(item.badges[0]);
    let highestProgressBadge = item.badges[0];
    for (let i = 1; i < item.badges.length; ++i) {
      item.badges[i].progress = item.progress;
      const badgeProgress = this.getProgressPercent(item.badges[i]);
      if (badgeProgress <= highestProgress && highestProgress === 100) {
        highestProgress = badgeProgress;
        highestProgressBadge = item.badges[i];
      }
    }
    return highestProgressBadge;
  }

  getProgressForActivity(
    badge: Badge,
    activity: { name: string; distance: number; number_activities: number }
  ) {
    let activityName: string;
    if (activity.name === 'run' || activity.name === 'walk') {
      activityName = 'runWalk';
    } else {
      activityName =
        activity.name === 'watersport-group'
          ? 'watersportGroup'
          : activity.name;
    }
    const progress =
      badge['progress'] && badge['progress'][activityName]
        ? Math.round(badge['progress'][activityName] * 10) / 10
        : 0;

    if (activity.distance) {
      return `${progress < activity.distance ? progress : activity.distance} / ${activity.distance}`;
    }
    return `${progress < activity.number_activities ? progress : activity.number_activities} / ${activity.number_activities}`;
  }

  getProgressPercentForActivity(
    badge: Badge,
    activity: { name: string; distance: number; number_activities: number }
  ) {
    let activityName: string;
    if (activity.name === 'run' || activity.name === 'walk') {
      activityName = 'runWalk';
    } else {
      activityName =
        activity.name === 'watersport-group'
          ? 'watersportGroup'
          : activity.name;
    }
    const progress =
      badge['progress'] && badge['progress'][activityName]
        ? Math.round(badge['progress'][activityName] * 10) / 10
        : 0;
    if (activity.distance) {
      return (
        ((progress < activity.distance ? progress : activity.distance) /
          activity.distance) *
        100
      );
    }
    return (
      ((progress < activity.number_activities
        ? progress
        : activity.number_activities) /
        activity.number_activities) *
      100
    );
  }

  getActivityName(activity: { name: string }) {
    if (activity.name === 'any') {
      return 'Activity';
    }
    if (activity.name === 'watersport-group') {
      return 'Water sport';
    }
    return (
      activity.name.substring(0, 1).toUpperCase() + activity.name.substring(1)
    );
  }

  hasBadgeStarted(badge: any) {
    if (badge.challenge_extra_data) {
      return new Date(badge.start_date) < new Date();
    }
    const startDate = this.event()?.ProjectParticipant?.cohort_start_date;
    if (startDate) {
      return new Date(startDate) < new Date();
    }
    return true;
  }

  getProgressPercent(badge: any) {
    let percent = 0;
    if (badge.badge_badge_type === 'cumulative_distance' && badge.progress) {
      percent = (badge.progress / badge.badge_reward_info.distance) * 100;
    } else if (badge.badge_badge_type === 'single_distance' && badge.progress) {
      percent = badge.unlocked_date ? 100 : 0;
    } else if (
      badge.badge_badge_type === 'non_distance_activity' &&
      badge.progress
    ) {
      percent =
        ((badge.progress.any ? badge.progress.any : badge.progress) /
          badge.badge_reward_info.activities[0].number_activities) *
        100;
    } else if (badge.badge_badge_type === 'activity' && badge.progress) {
      const name = badge.badge_reward_info.activities[0].name;
      percent =
        (badge.progress[name === 'walk' || name === 'run' ? 'runWalk' : name] /
          badge.badge_reward_info.activities[0].distance) *
        100;
    } else if (badge.badge_badge_type === 'streak' && badge.progress) {
      percent = (badge.progress.streak / badge.badge_reward_info.streak) * 100;
    } else if (badge.badge_type === 'Personal') {
      percent =
        ((this.event() as any).total_user_distance / badge.distance) * 100;
    } else if (badge.badge_type === 'Team') {
      percent = (this.event() as any).largest_team
        ? ((this.event() as any).largest_team.total_team_distance /
            badge.distance) *
          100
        : 0;
    } else if (badge.badge_badge_type === 'active_days') {
      percent = (badge.progress / badge.badge_reward_info.active_days) * 100;
    } else if (badge.challenge_extra_data) {
      if (badge.challenge_type === 'single') {
        percent = badge.unlocked_date ? 100 : 0;
      } else if (badge.challenge_type === 'activity') {
        percent =
          (badge.progress / badge.challenge_completion_info.number_activities) *
          100;
      } else if (badge.challenge_type === 'timed') {
        percent =
          (badge.progress / badge.challenge_completion_info.minutes_activity) *
          100;
      } else if (badge.challenge_type === 'streak') {
        percent =
          (badge.progress / badge.challenge_completion_info.streak_count) * 100;
      }
    } else if (badge.badge_badge_type === 'total_time' && badge.progress) {
      percent = (badge.progress / badge.badge_reward_info.total_time) * 100;
    } else if (badge.badge_badge_type === 'total_seasons' && badge.progress) {
      percent = (badge.progress / badge.badge_reward_info.number_seasons) * 100;
    } else if (badge.badge_badge_type === 'variety' && badge.progress) {
      percent = (badge.progress / badge.badge_reward_info.number_variety) * 100;
    } else {
      percent = badge.unlocked_date ? 100 : 0;
    }
    if (percent > 100) {
      percent = 100;
    }
    return percent;
  }

  getBadgeValueUnits(badge: any) {
    if (badge.badge_badge_type === 'cumulative_distance') {
      return 'km';
    } else if (badge.badge_badge_type === 'single_distance') {
      return 'km';
    } else if (badge.badge_badge_type === 'non_distance_activity') {
      return 'activities';
    } else if (badge.badge_badge_type === 'streak') {
      return 'days';
    } else if (badge.badge_badge_type === 'activity') {
      return 'km';
    } else if (badge.badge_badge_type === 'total_time') {
      return 'min';
    } else if (badge.badge_badge_type === 'total_seasons') {
      return 'seasons';
    } else if (badge.badge_badge_type === 'variety') {
      return 'activities';
    } else if (badge.badge_badge_type === 'active_days') {
      return 'days';
    } else if (badge.badge_type === 'Personal') {
      return 'km';
    } else if (badge.badge_type === 'Team') {
      return 'km';
    } else if (badge.challenge_type) {
      if (badge.challenge_type === 'timed') {
        return 'min';
      } else if (badge.challenge_type === 'activity') {
        return 'activities';
      } else if (badge.challenge_type === 'streak') {
        return 'days';
      }
      return '';
    }
    return '';
  }

  getProgressValue(badge: any) {
    let roundedValue = 0;
    if (badge.badge_badge_type === 'cumulative_distance' && badge.progress) {
      roundedValue = Math.round(badge.progress * 10) / 10;
      if (roundedValue > badge.badge_reward_info.distance) {
        roundedValue = badge.badge_reward_info.distance;
      }
    } else if (badge.badge_badge_type === 'single_distance' && badge.progress) {
      roundedValue = badge.unlocked_date ? badge.badge_reward_info.distance : 0;
    } else if (
      badge.badge_badge_type === 'non_distance_activity' &&
      badge.progress
    ) {
      roundedValue =
        Math.round(
          (badge.progress.any ? badge.progress.any : badge.progress) * 10
        ) / 10;
      if (
        roundedValue > badge.badge_reward_info.activities[0].number_activities
      ) {
        roundedValue = badge.badge_reward_info.activities[0].number_activities;
      }
    } else if (
      badge.badge_badge_type === 'activity' &&
      badge.progress &&
      Object.keys(badge.progress).length > 0
    ) {
      const name = badge.badge_reward_info.activities[0].name;
      roundedValue =
        Math.round(
          badge.progress[name === 'walk' || name === 'run' ? 'runWalk' : name] *
            10
        ) / 10;
      if (roundedValue > badge.badge_reward_info.activities[0].distance) {
        roundedValue = badge.badge_reward_info.activities[0].distance;
      }
    } else if (badge.badge_badge_type === 'streak' && badge.progress) {
      roundedValue = Math.round(badge.progress.streak * 10) / 10;
      if (roundedValue > badge.badge_reward_info.streak) {
        roundedValue = badge.badge_reward_info.streak;
      }
    } else if (badge.badge_type === 'Personal') {
      roundedValue =
        Math.round((this.event() as any).total_user_distance * 10) / 10;
      if (roundedValue > badge.distance) {
        roundedValue = badge.distance;
      }
    } else if (badge.badge_type === 'Team') {
      roundedValue = (this.event() as any).largest_team
        ? Math.round(
            (this.event() as any).largest_team.total_team_distance * 10
          ) / 10
        : 0;
      if (roundedValue > badge.distance) {
        roundedValue = badge.distance;
      }
    } else if ((badge as any).challenge_extra_data) {
      if (badge.challenge_type === 'single') {
        roundedValue = badge.unlocked_date ? badge.distance : 0;
      } else if (badge.challenge_type === 'activity') {
        roundedValue = Math.round(badge.progress * 10) / 10;
        if (roundedValue > badge.challenge_completion_info.number_activities) {
          roundedValue = badge.challenge_completion_info.number_activities;
        }
      } else if (badge.challenge_type === 'timed') {
        roundedValue = Math.round(badge.progress * 10) / 10;
        if (roundedValue > badge.challenge_completion_info.minutes_activity) {
          roundedValue = badge.challenge_completion_info.minutes_activity;
        }
      } else if (badge.challenge_type === 'streak') {
        roundedValue = Math.round(badge.progress * 10) / 10;
        if (roundedValue > badge.challenge_completion_info.streak_count) {
          roundedValue = badge.challenge_completion_info.streak_count;
        }
      } else {
        roundedValue = badge.progress;
      }
    } else if (badge.badge_badge_type === 'total_time' && badge.progress) {
      roundedValue = Math.round(badge.progress * 10) / 10;
      if (roundedValue > badge.badge_reward_info.total_time) {
        roundedValue = badge.badge_reward_info.total_time;
      }
    } else if (badge.badge_badge_type === 'total_seasons' && badge.progress) {
      roundedValue = Math.round(badge.progress * 10) / 10;
      if (roundedValue > badge.badge_reward_info.number_seasons) {
        roundedValue = badge.badge_reward_info.number_seasons;
      }
    } else if (badge.badge_badge_type === 'variety' && badge.progress) {
      roundedValue = Math.round(badge.progress * 10) / 10;
      if (roundedValue > badge.badge_reward_info.number_variety) {
        roundedValue = badge.badge_reward_info.number_variety;
      }
    } else if (badge.badge_badge_type === 'active_days' && badge.progress) {
      roundedValue = Math.round(badge.progress * 10) / 10;
      if (roundedValue > badge.badge_reward_info.active_days) {
        roundedValue = badge.badge_reward_info.active_days;
      }
    } else {
      roundedValue = badge.unlocked_date ? this.getBadgeRewardValue(badge) : 0;
    }

    return roundedValue;
  }

  getBadgeRewardValue(badge: any) {
    if (
      badge.badge_badge_type === 'cumulative_distance' ||
      badge.badge_badge_type === 'single_distance'
    ) {
      return badge.badge_reward_info.distance;
    } else if (badge.badge_badge_type === 'non_distance_activity') {
      return badge.badge_reward_info.activities[0].number_activities;
    } else if (badge.badge_badge_type === 'activity') {
      return badge.badge_reward_info.activities[0].distance;
    } else if (badge.badge_badge_type === 'streak') {
      return badge.badge_reward_info.streak;
    } else if (badge.badge_type === 'Personal') {
      return (badge as any).distance;
    } else if (badge.badge_type === 'Team') {
      return (badge as any).distance;
    } else if (badge.badge_badge_type === 'active_days') {
      return (badge as any).badge_reward_info.active_days;
    } else if (badge.badge_badge_type === 'total_time') {
      return badge.badge_reward_info.total_time;
    } else if (badge.badge_badge_type === 'total_seasons') {
      return badge.badge_reward_info.number_seasons;
    } else if (badge.badge_badge_type === 'variety') {
      return badge.badge_reward_info.number_variety;
    } else if ((badge as any).challenge_extra_data) {
      if (badge.challenge_type === 'single') {
        return (badge as any).distance;
      } else if (badge.challenge_type === 'activity') {
        return badge.challenge_completion_info.number_activities;
      } else if (badge.challenge_type === 'timed') {
        return badge.challenge_completion_info.minutes_activity;
      } else if (badge.challenge_type === 'streak') {
        return badge.challenge_completion_info.streak_count;
      }
    } else {
      return 1;
    }
  }

  getBadgeBrightness(badge: any, selectedGroupBadge: any) {
    if (
      selectedGroupBadge.badge_reward_info &&
      selectedGroupBadge.badge_reward_info.activities
    ) {
      return `brightness(${selectedGroupBadge.unlocked_date ? 100 : 50}%)`;
    }
    if (badge.id === selectedGroupBadge.id) {
      const badgeProgress = this.getProgressPercent(selectedGroupBadge);
      return `brightness(${badgeProgress < 40 ? 40 : badgeProgress}%)`;
    }
    if (selectedGroupBadge.badge_order < badge.badge_order) {
      return 'brightness(100%)';
    }
    return 'brightness(50%)';
  }

  // openSweepstakes() {
  //   this.dialogsUtil.openSweepstakes(this.season);
  //   this.mainUtil.sendGoogleAnalyticsEvent('BadgeProgress_GearUpForSummer');
  // }
}
