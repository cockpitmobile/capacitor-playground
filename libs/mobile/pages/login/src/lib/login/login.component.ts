import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  currentSeasonNewUserSignUpLink,
  currentSeasonOnboardingImageLink,
  currentSeasonPrimaryColor,
  currentSeasonSecondaryColor,
  currentSeasonWelcomeText,
  LoginActions,
  loginStep,
} from '@cockpit/mobile/state/login';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from '@cockpit/snackbar-service';
import { InAppBrowserActions } from '@cockpit/state-in-app-browser';

@Component({
  selector: 'cockpit-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckbox,
    FormsModule,
    MatButton,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _store = inject(Store);
  private readonly _fb = inject(FormBuilder);
  private readonly _snackbar = inject(SnackbarService);

  readonly primaryColor$ = this._store.select(currentSeasonPrimaryColor);
  readonly secondaryColor$ = this._store.select(currentSeasonSecondaryColor);
  readonly welcomeText$ = this._store.select(currentSeasonWelcomeText);
  readonly onboardingImage$ = this._store.select(
    currentSeasonOnboardingImageLink
  );
  readonly newAccountLink$ = this._store.select(currentSeasonNewUserSignUpLink);
  readonly currentStep$ = this._store.select(loginStep);

  helpHref = signal('');
  code = '';

  hasEmailedCode = false;
  emailFormCtrl = new FormControl('', [Validators.required, Validators.email]);
  sendEventUpdatesCtrl = new FormControl(true);

  form = this._fb.group({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  async ngOnInit() {
    // this.mainUtil.showSafeArea = false;
    // this.statusBar.show();
    //
    // let device;
    // if (this.device.model && this.device.manufacturer) {
    //   device = `${this.device.model} ${this.device.manufacturer}`;
    //   while (device.includes(' ')) {
    //     device = device.replace(' ', '-');
    //   }
    // }
    // this.helpHref = 'mailto:hello@nationwiderun.org?subject=Need help&body=Info for our team: app version ' + (this.mainUtil.isIOS ? WebVersion.iosVersion : WebVersion.androidVersion) + (this.mainUtil.buildVersion ? ' build ' + this.mainUtil.buildVersion : '') + (this.deviceDetectorService.device ? ' os ' + this.deviceDetectorService.device : '') + (device ? ' device ' + device : '');

    this.loadSeasonSignIn();
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

    // this.currentStep.set('projectLogin');
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

  async emailCode() {
    this.hasEmailedCode = true;
    await this.sendCodeForNewFlow();
    // this.currentStep.set('code');
  }

  async createNewAccount() {
    const newAccountLink = await firstValueFrom(this.newAccountLink$);
    const url = `${newAccountLink}?email=${this.emailFormCtrl.value}&agreeEventUpdates=${this.sendEventUpdatesCtrl.value}`;

    this.backToLogin(true);
    // this.mainUtil.openWebpage(url, false);
  }

  hasLoginCode() {
    // this.currentStep.set('code');
  }

  checkEmail() {
    const email = this.emailFormCtrl.value;
    if (!this.emailFormCtrl.valid) {
      this._snackbar.open('Please enter a valid email address');
      return;
    }

    if (email) {
      this._store.dispatch(
        LoginActions.loadUserWithEmail({
          email: email.trim().toLowerCase(),
        })
      );
    }

    // this.mainUtil.isLoading = { message: 'Checking Email' };
    //       this.mainUtil.isLoading = false;
    //     },
    //     error: (error) => {
    //       this.mainUtil.showSnackbar(
    //         'There was an error checking the email. Please try again.'
    //       );
    //       this.mainUtil.isLoading = false;
    //     },
  }

  login() {
    // let response;
    // if (this.form.valid) {
    //   this.mainUtil.isLoading = { message: 'Signing In' };
    //   response = await this.userService.authenticate(this.form.value.email.toLowerCase().trim(), this.form.value.password)
    //     .pipe(timeout(this.mainUtil.timeoutLimit)).toPromise().catch((error) => {
    //       this.mainUtil.handleError(error);
    //     });
    //
    //   if (!response || !response.user) {
    //     this.mainUtil.isLoading = false;
    //     return false;
    //   }
    // } else {
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
  }

  checkCode() {
    if (!this.code) {
      this._snackbar.open('Please enter an access code');
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

  async sendCodeForNewFlow() {
    // this.mainUtil.isLoading = { message: 'Sending Code' };
    // try {
    //   await this.userService
    //     .resetUserPasscode(this.emailFormCtrl.value.trim(), undefined)
    //     .pipe(timeout(this.mainUtil.timeoutLimit))
    //     .toPromise();
    // } catch (error) {
    //   this.mainUtil.handleError(error);
    //   this.dialogsUtil.showConfirmationDialog(
    //     'Code failed to send, please try again.',
    //     'Code send failed',
    //     'Okay',
    //     'Cancel',
    //     true
    //   );
    // }
    // this.mainUtil.isLoading = false;
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
