import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  currentSeasonOnboardingImageLink,
  currentSeasonPrimaryColor,
  currentSeasonSecondaryColor,
  currentSeasonWelcomeText,
  LoginActions,
  loginStep,
} from '@cockpit/mobile/state/login';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '@cockpit/snackbar-service';
import { InAppBrowserActions } from '@cockpit/state-in-app-browser';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { getHelpLinkFromDeviceAndAppInfo } from '@cockpit/util-device';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { ChallengesService } from '@cockpit/mobile-data-access-challenges';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'cockpit-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Checkbox,
    FormsModule,
    Button,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _store = inject(Store);
  private readonly _snackbar = inject(SnackbarService);
  private readonly _projects = inject(EventService);
  private readonly _challenges = inject(ChallengesService);

  readonly primaryColor$ = this._store.select(currentSeasonPrimaryColor);
  readonly secondaryColor$ = this._store.select(currentSeasonSecondaryColor);
  readonly welcomeText$ = this._store.select(currentSeasonWelcomeText);
  readonly onboardingImage$ = this._store.select(
    currentSeasonOnboardingImageLink
  );
  readonly currentStep$ = this._store.select(loginStep);

  public readonly projects = this._projects.events;
  public readonly challenges = this._challenges.challenges;

  // public readonly _logProjects = effect(() => {
  //   const projects = this.projects();
  //   const challenges = this.challenges();
  //
  //   const projectsWithChallenges = projects.map((project) => ({
  //     ...project,
  //     challenges: challenges.filter(
  //       (challenge) => challenge.project_id === project.id
  //     ),
  //   }));
  //
  //   return projectsWithChallenges.sort((a, b) => {
  //     const aName = a.title.toLowerCase();
  //     const bName = b.title.toLowerCase();
  //     return aName.localeCompare(bName);
  //   });
  // });

  helpHref = signal('');
  code = '';

  hasEmailedCode = false;
  emailFormCtrl = new FormControl('', [Validators.required, Validators.email]);
  sendEventUpdatesCtrl = new FormControl(true);

  ngOnInit() {
    // this.mainUtil.showSafeArea = false;
    // this.statusBar.show();

    // TODO: Apple privacy manifest requirements: https://capacitorjs.com/docs/apis/device#deviceinfo
    Promise.all([Device.getInfo(), App.getInfo()]).then(([device, app]) =>
      this.helpHref.set(getHelpLinkFromDeviceAndAppInfo(device, app))
    );
  }

  loadSeasonSignIn() {
    // this.mainUtil.isLoading = false;
    // setTimeout(() => {
    //   const topImgColor = document.getElementById('topImgColor');
    //   this.topImgColor = `${topImgColor.getBoundingClientRect().top}px`;
    //   setTimeout(() => {
    //     this.topImgColor = `48px`;
    //     setTimeout(() => {
    //       this.startAnimation = true;
    //       const onboardingImage = document.getElementById('onboardingImage');
    //       const onboardingImageHeight = onboardingImage.getBoundingClientRect().height;
    //       this.topFormColor = `${innerHeight - onboardingImageHeight - (this.mainUtil.isIOS ? 242 : 240)}px`;
    //     }, 1000);
    //   }, 2000);
    // }, 10);
  }

  backToLogin(skipResets = false) {
    if (!skipResets) {
      this.emailFormCtrl.patchValue('');
      this.hasEmailedCode = false;
      this.code = '';
    }

    this._store.dispatch(LoginActions.backToLoginClicked());
  }

  keydown(event: any, type: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      switch (type) {
        case 'code':
          this.checkCode();
          break;
        case 'email':
          this.checkEmail();
          break;
      }
    }
  }

  emailCode() {
    this.hasEmailedCode = true;
    this.sendCodeForNewFlow();
  }

  createNewAccount() {
    this.backToLogin(true);
    this._store.dispatch(
      LoginActions.createNewAccount({
        email: this.emailFormCtrl.value as string,
        sendEmailUpdates: this.sendEventUpdatesCtrl.value as boolean,
      })
    );
  }

  hasLoginCode() {
    this._store.dispatch(LoginActions.hasLoginCodeClicked());
  }

  checkEmail() {
    const email = this.emailFormCtrl.value;
    if (!this.emailFormCtrl.valid) {
      // this._snackbar.open('Please enter a valid email address');
      return;
    }

    if (email) {
      this._store.dispatch(
        LoginActions.loadUserWithEmail({
          email: email.trim().toLowerCase(),
        })
      );
    }
  }

  login() {
    // let response;
    //   if (this.code) {
    //     response = await this.userService.authenticate('', this.code.toUpperCase().trim())
    //       .pipe(timeout(this.mainUtil.timeoutLimit)).toPromise().catch((error) => {
    //         console.log(error);
    //         this.mainUtil.handleError(error);
    //       });
    //   }
    //   if (!response || !response.user || !response.user.has_authenticated) {
    //     this.mainUtil.isLoading = false;
    //     if (response.user && response.projects && !response.user.has_authenticated) {
    //       this.userService.currentUser = response.user;
    //       this.userService.currentUser.worker_projects = response.projects;
    //     }
    //     return false;
    //   }
    // this.userService.currentUser = response.user;
    //
    // if (this.userService.currentUser.is_participant) {
    //   try {
    //     const x = await forkJoin([
    //       this.userService.getAppSwitches(),
    //       this.petService.getPetsForOwner(this.userService.currentUser.id),
    //       this.userService.getUsersUpcomingPlans(this.userService.currentUser.id),
    //       this.userService.getUnreadNotifications(this.userService.currentUser.id),
    //       this.userService.getUserUnlockedBadges(this.userService.currentUser.id),
    //       this.userService.getUserTickets(this.userService.currentUser.id),
    //     ]).pipe(timeout(this.mainUtil.timeoutLimit)).toPromise();
    //     const userInfo = x[0];
    //     const plans = x[2];
    //     this.raceTeamService.userPlans = plans.user_plans;
    //     this.raceTeamService.userPlans.forEach(element => {
    //       element.RaceTeamMember = plans.race_team_members.find(r => r.race_team_id === element.race_team_id);
    //     });
    //     const notifications = x[3];
    //     this.userService.currentUser.unread_notifications = notifications.notifications;
    //     this.userService.currentUser.unlocked_badges = x[4].unlocked_badges;
    //     this.userUtil.setCurrentUserTickets(x[5].tickets);
    //     this.userService.currentUser.appSwitch = userInfo;
    //     this.userService.currentUser.worker_projects = response.projects;
    //     await this.mainUtil.sortProjects();
    //     await this.mainUtil.setParticipantAndDates();
    //     this.mainUtil.setProjectTimesAccordingToTimezones();
    //
    //     try {
    //       (window as any).plugins.appsFlyer.logEvent('af_login', { email: this.userService.currentUser.email, user_id: this.userService.currentUser.id, isProduction: environment.production }, () => { console.log('SUCCESS!!'); }, (err) => { console.log('ERROR'); console.log(err); });
    //     } catch (err) {
    //       console.log(err);
    //     }
    //
    //     try {
    //       (window as any).facebookConnectPlugin.logEvent('login', {}, 0, () => console.log('FB EVENT SUCCESS'), fbErr => { console.log('FB EVENT ERROR'); console.error(fbErr); });
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   } catch (error) {
    //     this.mainUtil.handleError(error);
    //     this.mainUtil.isLoading = false;
    //     return false;
    //   }
    // } else {
    //   let companyId = localStorage.getItem(this.userService.currentUser.id + '-companyId');
    //   if (!companyId || companyId.length === 0) {
    //     companyId = this.userService.currentUser.companies[0].id;
    //     localStorage.setItem(this.userService.currentUser.id + '-companyId', companyId);
    //   }
    //   const userInfo = await forkJoin([
    //     this.companyService.getCompany(companyId),
    //     this.projectService.getProjectsForCompanyUser(this.userService.currentUser.id, companyId),
    //     this.userService.getUserUnlockedBadges(this.userService.currentUser.id)
    //   ]).pipe(timeout(this.mainUtil.timeoutLimit)).toPromise().catch((error) => {
    //     this.mainUtil.handleError(error);
    //   });
    //   if (!userInfo) {
    //     this.mainUtil.isLoading = false;
    //     return false;
    //   }
    //
    //   this.companyService.currentCompany = userInfo[0];
    //   this.userService.currentUser.worker_projects = userInfo[1].projects;
    //   await this.mainUtil.setParticipantAndDates();
    //   await this.localDbService.storeCompanyInformation(this.companyService.currentCompany);
    // }
    // let savedCompanyId = localStorage.getItem(this.userService.currentUser.id + '-companyId');
    // if (!savedCompanyId) {
    //   savedCompanyId = this.userService.currentUser.companies.length ? this.userService.currentUser.companies[0].id : '0000';
    // }
    // await this.localDbService.storeProjects(this.userService.currentUser.worker_projects, savedCompanyId);
    // await this.localDbService.storeUserInformation(this.userService.currentUser);
    //
    // this.mainUtil.sendGoogleAnalyticsEvent('SignIn_Login');
    // document.getElementById('body').classList.add('dailyDistanceInputs');
    // this.router.navigateByUrl('user').then(() => {
    //   this.mainUtil.isLoading = false;
    //   this.dialogsUtil.checkNotifications();
    //   this.mainUtil.showSafeArea = true;
    // }).catch(() => {
    //   this.mainUtil.isLoading = false;
    // });
    // return true;
  }

  checkCode() {
    if (!this.code) {
      // this._snackbar.open('Please enter an access code');
    }

    // this.mainUtil.isLoading = { message: 'Checking code' };
    //   const passcodeInformation = await this.userService
    //     .getPasscodeInformation(this.code.toUpperCase().trim())
    //     .pipe(timeout(this.mainUtil.timeoutLimit))
    //     .toPromise()
    //     .catch((error) => {
    //       this.mainUtil.handleError(error);
    //     });
    //   if (!passcodeInformation) {
    //     this.mainUtil.isLoading = false;
    //     return;
    //   }
    //   if (passcodeInformation.isUserCode) {
    //     this.router
    //       .navigate(['UserSetup', passcodeInformation.userId])
    //       .then(() => {
    //         this.mainUtil.showSafeArea = true;
    //         this.mainUtil.isLoading = false;
    //       })
    //       .catch(() => {
    //         this.mainUtil.isLoading = false;
    //       });
    //     this.mainUtil.sendGoogleAnalyticsEvent('Passcode_SubmitUserCode');
    //   } else {
    //     this.mainUtil.isLoading = false;
    //     this.mainUtil.showSnackbar(
    //       `That passcode does not exist. If you don't have a code or you don't have an account, select the corresponding option.`
    //     );
    //   }
  }

  sendCodeForNewFlow() {
    this._store.dispatch(
      LoginActions.sendNewAccessCode({
        email: this.emailFormCtrl.value as string,
      })
    );
  }

  privacyPolicy() {
    this._store.dispatch(
      InAppBrowserActions.openWebPage({
        url: 'https://nationwiderun.org/policies/privacy-policy',
        inApp: false,
      })
    );
  }
}
