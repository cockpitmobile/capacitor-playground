import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsersService } from '@cockpit/mobile-data-access-users';
import { User } from '@cockpit/mobile/data-models';
import { AppService } from '@cockpit/mobile-data-access-app';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-user-settings-page',
  imports: [CommonModule, ToggleSwitch, ReactiveFormsModule, FormsModule],
  templateUrl: './user-settings-page.component.html',
  styleUrl: './user-settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsPageComponent implements OnInit {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _user = inject(UsersService);
  private readonly _appService = inject(AppService);

  public readonly currentUser = this._user.currentUser;

  // TODO:
  // methodize team-goal-alert in app service
  form = this._fb.group({
    raceAnnouncements: this.currentUser()?.settings?.raceAnnouncements,
    selfie_privacy_setting:
      this.currentUser()?.settings?.selfie_privacy_setting || 'public',
    race_share_setting:
      this.currentUser()?.settings?.race_share_setting || 'all_teams',
    achievement_share_setting:
      this.currentUser()?.settings?.achievement_share_setting || 'all_teams',
    comment_notifications_enabled:
      this.currentUser()?.settings?.comment_notifications_enabled,
    badge_email_setting:
      // eslint-disable-next-line no-prototype-builtins
      this.currentUser()?.settings?.hasOwnProperty('badge_email_setting')
        ? this.currentUser()?.settings?.badge_email_setting
        : true,
    challenge_email_setting:
      // eslint-disable-next-line no-prototype-builtins
      this.currentUser()?.settings?.hasOwnProperty('challenge_email_setting')
        ? this.currentUser()?.settings?.challenge_email_setting
        : true,
    race_progress_email_setting:
      // eslint-disable-next-line no-prototype-builtins
      this.currentUser()?.settings?.hasOwnProperty(
        'race_progress_email_setting'
      )
        ? this.currentUser()?.settings?.race_progress_email_setting
        : true,
    goal_progress_email_setting:
      // eslint-disable-next-line no-prototype-builtins
      this.currentUser()?.settings?.hasOwnProperty(
        'goal_progress_email_setting'
      )
        ? this.currentUser()?.settings?.goal_progress_email_setting
        : true,
    teamGoal: localStorage.getItem('team-goal-alert') === 'true',
    shouldDisplayReleaseNotes: this._appService.getIfDisplayReleaseNotes()
      ? 'true'
      : 'false',
    autoImportStrava: this._appService.getIfAutoImportStrava(),
    useRoboVoice: this.currentUser()?.settings?.useRobotVoice || false,
  });
  selfieSettings = signal([
    { title: 'Just me', value: 'private' },
    { title: 'Private teams', value: 'private_teams' },
    { title: 'Public', value: 'public' },
  ]);
  runSettings = signal([
    { title: 'Just me', value: 'private' },
    { title: 'Private teams', value: 'private_teams' },
    { title: 'All teams', value: 'all_teams' },
  ]);
  selfieSaveItemList = signal([
    { title: 'Always', value: 'Always' },
    { title: 'Ask every time', value: 'Ask every time' },
    { title: 'Never', value: 'Never' },
  ]);
  selfieSaveSelection = signal('');
  reminderSettingsTemp = signal<{
    isToggled: boolean;
    reminders: { title: string; isToggled: boolean }[];
    time: Date | null;
    frequency: number;
  }>({
    isToggled: false,
    reminders: [
      { title: 'Sun', isToggled: false },
      { title: 'Mon', isToggled: false },
      { title: 'Tue', isToggled: false },
      { title: 'Wed', isToggled: false },
      { title: 'Thu', isToggled: false },
      { title: 'Fri', isToggled: false },
      { title: 'Sat', isToggled: false },
    ],
    time: null,
    frequency: 1.5,
  });

  ngOnInit() {
    this.setSelfieSaveSelection();

    this.reminderSettingsTemp.update((tempSettings) => ({
      ...tempSettings,
      isToggled: this.currentUser()?.has_reminders_on || false,
      reminders: [
        {
          title: 'Sun',
          isToggled: this.currentUser()?.has_reminder_sunday || false,
        },
        {
          title: 'Mon',
          isToggled: this.currentUser()?.has_reminder_monday || false,
        },
        {
          title: 'Tue',
          isToggled: this.currentUser()?.has_reminder_tuesday || false,
        },
        {
          title: 'Wed',
          isToggled: this.currentUser()?.has_reminder_wednesday || false,
        },
        {
          title: 'Thu',
          isToggled: this.currentUser()?.has_reminder_thursday || false,
        },
        {
          title: 'Fri',
          isToggled: this.currentUser()?.has_reminder_friday || false,
        },
        {
          title: 'Sat',
          isToggled: this.currentUser()?.has_reminder_saturday || false,
        },
      ],
      time: this.currentUser()?.reminder_time
        ? new Date(this.currentUser()!.reminder_time!)
        : null,
      frequency: this.currentUser()?.times_exercise_per_week || 1.5,
    }));
  }

  close() {
    // TODO:
    // if (
    //   !this.userService.currentUser.selfie_privacy_setting &&
    //   !this.userService.currentUser.race_share_setting &&
    //   !this.userService.currentUser.achievement_share_setting
    // ) {
    //   this.userService.currentUser.selfie_privacy_setting = 'public';
    //   this.userService.currentUser.race_share_setting = 'all_teams';
    //   this.userService.currentUser.achievement_share_setting = 'all_teams';
    //   await this.userService
    //     .updateUser(this.user.id, {
    //       selfie_privacy_setting:
    //         this.userService.currentUser.selfie_privacy_setting,
    //       race_share_setting: this.userService.currentUser.race_share_setting,
    //       achievement_share_setting:
    //         this.userService.currentUser.achievement_share_setting,
    //     } as User)
    //     .pipe(timeout(this.mainUtil.timeoutLimit))
    //     .toPromise()
    //     .catch((error) => {
    //       this.mainUtil.handleError(error);
    //     });
    //   this.localdbService.storeUserInformation(this.userService.currentUser);
    // }
    //
    // this.submit();
  }

  checkPermissions(type: string) {
    // TODO:
    // const hasPermission = await new Promise(async (resolve) => {
    //   await (cordova as any).plugins.diagnostic.isRemoteNotificationsEnabled(
    //     (res: any) => {
    //       resolve(res);
    //     },
    //     () => {
    //       console.log('Error checking permissions for push notifications');
    //     }
    //   );
    // });
    // if (!hasPermission) {
    //   this.form.controls.raceAnnouncements.setValue(false);
    //   this.form.controls.comment_notifications_enabled.setValue(false);
    //   const result = await this.dialogsUtil2.showConfirmationDialog(
    //     'To receive any notifications, you must enabled notifications in your app settings.',
    //     'Enable Notifications',
    //     'Open app settings'
    //   );
    //   if (result) {
    //     this.diagnostic.switchToSettings();
    //   }
    // } else if (type === 'season') {
    //   if (!this.form.controls.raceAnnouncements.value) {
    //     const result = await this.dialogsUtil2.showConfirmationDialog(
    //       'If you turn off season notifications, you will miss important announcements and updates. Are you sure you want to turn them off?',
    //       'Season notifications',
    //       'Yes'
    //     );
    //     if (!result) {
    //       this.form.controls.raceAnnouncements.setValue(true);
    //     }
    //   }
    // } else if (type === 'comments') {
    //   if (!this.form.controls.comment_notifications_enabled.value) {
    //     const result = await this.dialogsUtil2.showConfirmationDialog(
    //       'If you turn off comment notifications, you will miss notifications relating to comments on your activities and comments in threads you are apart of. Are you sure you want to turn them off?',
    //       'Season notifications',
    //       'Yes'
    //     );
    //     if (!result) {
    //       this.form.controls.comment_notifications_enabled.setValue(true);
    //     }
    //   }
    // }
  }

  setAlerts(type: string) {
    localStorage.setItem(
      'team-goal-alert',
      this.form.controls.teamGoal.value ? 'false' : 'true'
    );
    // TODO: snackbar message
    // const snackbarMessage = `Team alerts have been turned ${this.form.controls.teamGoal.value ? 'off' : 'on'}`;
    // this.mainUtil.showSnackbar(snackbarMessage, 3000);
  }

  // setEmails(type: string) {
  // let emailType = '';
  // let onOrOff = '';
  // if (type === 'badge') {
  //   emailType = 'Badge emails';
  //   onOrOff = this.form.value.badge_email_setting ? 'off' : 'on';
  // } else if (type === 'challenge') {
  //   emailType = 'Challenge emails';
  //   onOrOff = this.form.value.challenge_email_setting ? 'off' : 'on';
  // } else if (type === 'race-progress') {
  //   emailType = 'Race progress emails';
  //   onOrOff = this.form.value.race_progress_email_setting ? 'off' : 'on';
  // } else if (type === 'goal-progress') {
  //   emailType = 'Goal progress emails';
  //   onOrOff = this.form.value.goal_progress_email_setting ? 'off' : 'on';
  // }
  // this.mainUtil.showSnackbar(
  //   `${emailType} have been turned ${onOrOff}`,
  //   3000
  // );
  // }

  submit() {
    const reminderUser = this.getUserForReminder();
    const currentUser = this.currentUser();
    if (this.form.valid && reminderUser && currentUser) {
      const {
        raceAnnouncements,
        selfie_privacy_setting,
        comment_notifications_enabled,
        badge_email_setting,
        challenge_email_setting,
        race_progress_email_setting,
        goal_progress_email_setting,
        achievement_share_setting,
        race_share_setting,
        useRoboVoice,
      } = this.form.getRawValue();

      try {
        this._user
          .updateUser({
            ...currentUser,
            settings: {
              ...currentUser.settings,
              raceAnnouncements: raceAnnouncements,
              comment_notifications_enabled: comment_notifications_enabled,
              badge_email_setting: badge_email_setting,
              challenge_email_setting: challenge_email_setting,
              race_progress_email_setting: race_progress_email_setting,
              goal_progress_email_setting: goal_progress_email_setting,
              achievement_share_setting: achievement_share_setting,
              selfie_privacy_setting: selfie_privacy_setting,
              race_share_setting: race_share_setting,
              useRobotVoice: useRoboVoice,
            },
            selfie_privacy_setting: selfie_privacy_setting,
            race_share_setting: race_share_setting,
            achievement_share_setting: achievement_share_setting,
            ...reminderUser,
          })
          .pipe()
          .subscribe();
        // TODO:
        // this.mainUtil.setIfDisplayReleaseNotes(this.shouldDisplayReleaseNotes);
        // this.mainUtil.setAutoImportStrava(
        //   this.autoImportStrava ? 'true' : 'false'
        // );
        // localStorage.setItem(
        //   'alwaysSaveSelfie',
        //   this.selfieSaveSelection === 'Always' ? 'true' : 'null'
        // );
        // localStorage.setItem(
        //   'neverSaveSelfie',
        //   this.selfieSaveSelection === 'Never' ? 'true' : 'null'
        // );
      } catch (error) {
        // this.mainUtil.showSnackbar(
        //   'Settings could not be updated. Please try again.'
        // );
      }
    }
  }

  changeSelfieSetting(setting: string) {
    this.form.controls.selfie_privacy_setting.setValue(setting);
  }

  changeRunSetting(setting: string) {
    this.form.controls.race_share_setting.setValue(setting);
  }

  changeAchievementSetting(setting: string) {
    this.form.controls.achievement_share_setting.setValue(setting);
  }

  setSelfieSaveSelection() {
    const alwaysSaveSelfieStorage = localStorage.getItem('alwaysSaveSelfie');
    const neverSaveSelfieStorage = localStorage.getItem('neverSaveSelfie');
    this.selfieSaveSelection.set(
      // eslint-disable-next-line no-nested-ternary
      alwaysSaveSelfieStorage === 'true'
        ? 'Always'
        : neverSaveSelfieStorage === 'true'
          ? 'Never'
          : 'Ask every time'
    );
  }

  toggleReminders(event: { checked: boolean }) {
    this.reminderSettingsTemp.update((tempSettings) => ({
      ...tempSettings,
      isToggled: event.checked,
    }));
  }

  getUserForReminder() {
    return {
      has_reminders_on: this.reminderSettingsTemp().isToggled,
      has_reminder_sunday: this.reminderSettingsTemp().reminders[0].isToggled,
      has_reminder_monday: this.reminderSettingsTemp().reminders[1].isToggled,
      has_reminder_tuesday: this.reminderSettingsTemp().reminders[2].isToggled,
      has_reminder_wednesday:
        this.reminderSettingsTemp().reminders[3].isToggled,
      has_reminder_thursday: this.reminderSettingsTemp().reminders[4].isToggled,
      has_reminder_friday: this.reminderSettingsTemp().reminders[5].isToggled,
      has_reminder_saturday: this.reminderSettingsTemp().reminders[6].isToggled,
      times_exercise_per_week: this.reminderSettingsTemp().frequency,
      reminder_time: this.reminderSettingsTemp().time
        ? this.reminderSettingsTemp().time
        : null,
    } as User;
  }
}
