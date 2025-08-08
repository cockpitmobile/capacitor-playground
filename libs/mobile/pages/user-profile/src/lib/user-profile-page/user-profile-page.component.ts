import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '@cockpit/mobile-data-access-users';
import { Activity, Badge } from '@cockpit/mobile/data-models';
import { getShortDayOfWeek, isSameDay } from '@cockpit/mobile-utils-dates';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { BadgesService } from '@cockpit/mobile-data-access-badges';
import { ActivitiesService } from '@cockpit/mobile/activities';
import { getDDRed, getRAATeamTagBlue } from '@cockpit/mobile-utils-colors';
import { AppService } from '@cockpit/mobile-data-access-app';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-user-profile-page',
  imports: [CommonModule, ProgressSpinner],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfilePageComponent implements OnInit {
  private readonly _userService = inject(UsersService);
  private readonly _eventsService = inject(EventService);
  private readonly _badgeService = inject(BadgesService);
  private readonly _activitiesService = inject(ActivitiesService);
  private readonly _appService = inject(AppService);

  public readonly feedItems = this._activitiesService.userActivities;
  public readonly currentUser = this._userService.currentUser;
  public readonly isMiles = this._appService.isMiles;

  public readonly state = signal('');
  public readonly gender = signal('');
  public readonly age = signal<number | string>(0);
  public readonly picture = signal('');
  public readonly borderColor = signal('');
  public readonly ddRed = signal(getDDRed());
  public readonly raaBlue = signal(getRAATeamTagBlue());
  public readonly streak = signal(0);
  public readonly totalDistanceRun = signal<number | undefined>(undefined);
  public readonly averagePace = signal<string | undefined>(undefined);
  public readonly totalActiveMinutes = signal<number | undefined>(undefined);
  public readonly averageMinutesPerActivity = signal<number | undefined>(
    undefined
  );
  public readonly timestamp = signal(new Date().getTime());

  public readonly profileInfo = computed(() => {
    const genderVal = this.gender();
    const ageVal = this.age();
    const stateVal = this.state();

    let result = '';

    if (genderVal) {
      result += genderVal;
    }

    if (genderVal && (ageVal || stateVal)) {
      result += ', ';
    }

    if (ageVal) {
      result += ageVal;
    }

    if (genderVal && ageVal && stateVal) {
      result += ', ';
    }

    if (stateVal) {
      result += stateVal;
    }

    return result;
  });
  public readonly profilePicture = computed(() => {
    const picture = this.picture();
    const timestamp = this.timestamp();

    if (picture) {
      return picture + '?' + timestamp;
    }
    return '';
  });

  badges: Badge[] = [];
  today = new Date();
  hasRunToday: any;
  streakDays: any[] = [];
  hasScrolled?: boolean;
  dialogElement: any;
  activeDays: any[] = [];
  streakIncreasedToday = false;
  atTopOfPage = true;

  ngOnInit() {
    this.dialogElement = document.getElementById('profile-dialog');
    if (this.dialogElement) {
      this.dialogElement.style.right = '0vw';
    }

    const currentUser = this.currentUser();

    this.picture.set(
      currentUser?.profile_photo_link
        ? currentUser.profile_photo_link + '-150'
        : ''
    );

    if (currentUser?.has_annual_pass) {
      this.borderColor.set(getDDRed());
    } else if (currentUser?.raa_team_tag) {
      this.borderColor.set(getRAATeamTagBlue());
    }

    this.setInfo();
    this.setFeed();
    this.setStreakDays();
    // TODO:
    // this.userService
    //   .getStreak(this.userService.currentUser.id)
    //   .pipe(timeout(this.mainUtil.timeoutLimit))
    //   .subscribe(
    //     (x) => {
    //       this.setStreakDays(x);
    //     },
    //     (err) => {
    //       this.mainUtil.handleError(err);
    //       console.error(JSON.stringify(err));
    //     }
    //   );
  }

  setStreakDays(
    data: {
      active_dates: Array<{ time_completed_at: string }>;
      streak: number;
    } | null = null
  ) {
    const current = new Date();
    current.setDate(current.getDate() - 4);
    this.streakDays = [];
    this.streak.set(data ? data.streak : 0);
    // TODO:
    // this.userService.currentUser.current_streak = this.streak;
    this.activeDays = data ? data.active_dates : [];
    this.hasRunToday = data
      ? data.active_dates.find((y) => {
          const date = new Date(y.time_completed_at);
          return isSameDay(date, new Date());
        })
      : false;
    this.streakIncreasedToday = this.hasRunToday;
    for (let i = 0; i < 7; i++) {
      this.streakDays.push({
        title: getShortDayOfWeek(current),
        isFilled: data
          ? data.active_dates.find((y) => {
              const date = new Date(y.time_completed_at);
              return isSameDay(date, current);
            })
          : false,
        isToday: isSameDay(current),
        isLoading: !data,
        isFuture: new Date() < current,
      });
      current.setDate(current.getDate() + 1);
    }
  }

  checkScroll(event: any) {
    const scroll = document.getElementById('scrollProfile');
    if (scroll) {
      this.atTopOfPage = scroll.scrollTop === 0;
    }

    if (!this.hasScrolled) {
      const topStats = document.getElementById('topStats');
      if (topStats && topStats.getBoundingClientRect().top < -430) {
        this.hasScrolled = true;
      }
    }
  }

  setFeed() {
    // TODO:
    // const response = await this.userService
    //   .getUserFeedItems(
    //     this.userService.currentUser.id,
    //     this.feedItems ? this.feedItems.length : 10,
    //     0
    //   )
    //   .pipe(timeout(this.mainUtil.timeoutLimit))
    //   .toPromise()
    //   .catch((error) => {
    //     this.mainUtil.handleError(error);
    //   });
    // if (!response) {
    //   return;
    // }
    // this.userService
    //   .getStreak(this.userService.currentUser.id)
    //   .pipe(timeout(this.mainUtil.timeoutLimit))
    //   .subscribe(
    //     (x) => {
    //       this.setStreakDays(x);
    //     },
    //     (err) => {
    //       this.mainUtil.handleError(err);
    //       console.error(JSON.stringify(err));
    //     }
    //   );
    //
    // this.feedItems = response.feed_items ? response.feed_items : [];
    // this.feedItems.forEach((feedItem) => {
    //   if (feedItem.time_completed_at) {
    //     feedItem['project'] = this.userService.currentUser.worker_projects.find(
    //       (x) => x.id === feedItem.project_id
    //     );
    //     if (feedItem.user_location_poly) {
    //       const decodedPolyline = polyline.decode(feedItem.user_location_poly);
    //       feedItem.distance_locations =
    //         this.trackerUtil.switchLatLngToLngLat(decodedPolyline);
    //     } else {
    //       feedItem.distance_locations = null;
    //     }
    //     if (feedItem.image_link) {
    //       feedItem.image_link =
    //         feedItem.image_link + '?' + new Date().getTime();
    //     }
    //     this.mainUtil.initializeEventResultTime(feedItem);
    //   }
    //   feedItem.currentUserReaction = feedItem.reactions.find(
    //     (x) => x.user_id === this.userService.currentUser.id
    //   );
    // });
    // await this.setStats();
  }

  open(eventResult: Activity) {
    // TODO:
    // const project = this.userService.currentUser.worker_projects.find(
    //   (x) => x.id === eventResult.project_id
    // );
    // this.mainUtil.sendGoogleAnalyticsEvent('Profile_ViewOldActivity');
    // this.dialog.open(ViewRouteDialogComponent, {
    //   data: {
    //     project,
    //     eventResult,
    //     trackerUtil: this.trackerUtil,
    //   },
    //   disableClose: true,
    //   minWidth: this.mainUtil.isMobile ? '100%' : '30rem',
    //   maxWidth: this.mainUtil.isMobile ? '100%' : '35rem',
    //   panelClass: 'new-myapp-no-padding-dialog',
    //   autoFocus: false,
    //   id: 'results-dialog',
    // });
  }

  scroll() {
    if (this.feedItems()) {
      // TODO:
      // const response = await this.userService
      //   .getUserFeedItems(
      //     this.userService.currentUser.id,
      //     10,
      //     this.feedItems.length
      //   )
      //   .pipe(timeout(this.mainUtil.timeoutLimit))
      //   .toPromise()
      //   .catch((error) => {
      //     this.mainUtil.handleError(error);
      //   });
      // if (!response) {
      //   return;
      // }
      //
      // response.feed_items.forEach((feedItem) => {
      //   if (feedItem.time_completed_at) {
      //     feedItem['project'] =
      //       this.userService.currentUser.worker_projects.find(
      //         (x) => x.id === feedItem.project_id
      //       );
      //     if (feedItem.user_location_poly) {
      //       const decodedPolyline = polyline.decode(
      //         feedItem.user_location_poly
      //       );
      //       feedItem.distance_locations =
      //         this.trackerUtil.switchLatLngToLngLat(decodedPolyline);
      //     } else {
      //       feedItem.distance_locations = null;
      //     }
      //     if (feedItem.image_link) {
      //       feedItem.image_link =
      //         feedItem.image_link + '?' + new Date().getTime();
      //     }
      //     this.mainUtil.initializeEventResultTime(feedItem);
      //   }
      //   feedItem.currentUserReaction = feedItem.reactions.find(
      //     (x) => x.user_id === this.userService.currentUser.id
      //   );
      //   this.feedItems.push(feedItem);
      // });
    }
  }

  openSettings() {
    // TODO:
    // const editProfileModal = this.dialog.open(ProfileEditDialogComponent, {
    //   disableClose: true,
    //   minWidth: this.mainUtil.isMobile ? '98%' : '30rem',
    //   maxWidth: this.mainUtil.isMobile ? '98%' : '40rem',
    //   panelClass: this.mainUtil.isIOS
    //     ? 'myapp-no-padding-dialog-ios'
    //     : 'myapp-no-padding-dialog',
    //   autoFocus: false,
    // });
    //
    // editProfileModal.afterClosed().subscribe(() => {
    //   if (this.userService.currentUser) {
    //     this.setInfo();
    //   }
    // });
  }

  setInfo() {
    const user = this.currentUser();

    if (user?.gender) {
      let gender = '';
      switch (user.gender) {
        case 'M':
          gender = 'Male';
          break;
        case 'F':
          gender = 'Female';
          break;
        case 'O':
          gender = 'Other';
          break;
        default:
          gender = 'No gender';
          break;
      }
      this.gender.set(gender);
    } else {
      this.gender.set('No gender');
    }

    if (user?.age) {
      this.age.set(user.age > 0 ? user.age : 'No age');
    } else {
      this.age.set('No age');
    }

    if (user?.state) {
      this.state.set(user.state === 'N/A' ? 'No state' : user.state);
    } else {
      this.state.set('No state');
    }
  }

  setStats() {
    // TODO:
    // const response = await this.projectService
    //   .getProfileStats(this.userService.currentUser.id)
    //   .pipe(timeout(this.mainUtil.timeoutLimit))
    //   .toPromise()
    //   .catch((error) => {
    //     this.mainUtil.handleError(error);
    //   });
    // if (!response) {
    //   return;
    // }
    //
    // this.totalActiveMinutes = response.total_active_minutes
    //   ? Math.floor(response.total_active_minutes * 10) / 10
    //   : 0;
    // this.averageMinutesPerActivity = response.average_minutes_per_activity
    //   ? Math.floor(response.average_minutes_per_activity * 10) / 10
    //   : 0;
    // this.totalDistanceRun = response.total_distance
    //   ? response.total_distance
    //   : 0;
    // if (!this.mainUtil.isMiles) {
    //   this.totalDistanceRun = this.totalDistanceRun * 1.60934;
    // }
    // this.totalDistanceRun = Math.floor(this.totalDistanceRun * 10) / 10;
    // let minutes = response.avg_pace;
    // if (!this.mainUtil.isMiles) {
    //   minutes = minutes / 1.60934;
    // }
    // let hours = 0;
    // if (minutes > 59) {
    //   hours = Math.floor(minutes / 60);
    // }
    // const seconds = Math.floor((minutes - Math.floor(minutes)) * 60);
    // minutes = Math.floor(minutes - hours * 60);
    // this.averagePace =
    //   (hours ? hours + ':' : '') +
    //   (hours && minutes < 10 ? '0' + minutes : minutes) +
    //   ':' +
    //   (seconds < 10 ? '0' + seconds : seconds);
  }

  viewActivityStats() {
    // TODO:
    // this.dialog.open(ActivityStatsComponent, {
    //   data: {},
    //   disableClose: true,
    //   hasBackdrop: false,
    //   minWidth: this.mainUtil.isMobile ? '100%' : '35rem',
    //   maxWidth: this.mainUtil.isMobile ? '100%' : '40rem',
    //   panelClass: 'slide-from-right-dialog',
    //   id: 'activity-stats-dialog',
    //   autoFocus: false,
    // });
  }

  addProfilePhoto(type: string) {
    // TODO:
    // const result = await this.dialogsUtil.getPhoto(type);
    // if (result) {
    //   try {
    //     const profilePhoto = await this.userService
    //       .uploadProfilePicture(
    //         this.userService.currentUser.id,
    //         result.blob as any
    //       )
    //       .pipe(timeout(this.mainUtil.imageTimeoutLimit))
    //       .toPromise();
    //     this.userService.currentUser.profile_photo_link = profilePhoto.link;
    //     await this.localdbService.storeUserInformation(
    //       this.userService.currentUser
    //     );
    //     this.picture = profilePhoto.link + '-150';
    //     // Need to set time stamp to append to image url to force angular to rerender (see getProfilePicture)
    //     this.timeStamp = new Date().getTime();
    //     this.mainUtil.showSnackbar(
    //       'Successfully uploaded your new profile picture!',
    //       2000
    //     );
    //     this.mainUtil.isLoading = false;
    //   } catch (e) {
    //     this.mainUtil.isLoading = false;
    //     this.mainUtil.showSnackbar(
    //       'Error uploading profile picture. Please try again.',
    //       2000
    //     );
    //     console.log(e);
    //   }
    // }
  }

  deleteProfilePicture() {
    // TODO:
    // try {
    //   const response = await this.dialogsUtil.showConfirmationDialog(
    //     'Are you sure you want to delete your profile picture?',
    //     'Delete Profile Picture',
    //     'Yes',
    //     'No'
    //   );
    //   if (response === 'yes') {
    //     this.mainUtil.isLoading = true;
    //     await this.userService
    //       .deleteProfilePicture(this.userService.currentUser.id)
    //       .pipe(timeout(this.mainUtil.imageTimeoutLimit))
    //       .toPromise();
    //     this.userService.currentUser.profile_photo_link = null;
    //     await this.localdbService.storeUserInformation(
    //       this.userService.currentUser
    //     );
    //     this.picture = null;
    //     this.mainUtil.isLoading = false;
    //     this.mainUtil.showSnackbar(
    //       'Successfully deleted your profile picture!',
    //       2000
    //     );
    //   }
    // } catch (e) {
    //   this.mainUtil.isLoading = false;
    //   this.mainUtil.showSnackbar(
    //     'Error deleting profile picture. Please try again.',
    //     2000
    //   );
    //   console.log(e);
    // }
  }
}
