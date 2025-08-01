import { Component, inject, OnInit, signal } from '@angular/core';
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
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { LoginService } from '@cockpit/mobile-data-access-login';
import { tap } from 'rxjs';

@Component({
  selector: 'cockpit-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Checkbox, FormsModule, Button],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _store = inject(Store);
  private readonly _snackbar = inject(SnackbarService);
  private readonly _loginService = inject(LoginService);

  readonly primaryColor$ = this._store.select(currentSeasonPrimaryColor);
  readonly secondaryColor$ = this._store.select(currentSeasonSecondaryColor);
  readonly welcomeText$ = this._store.select(currentSeasonWelcomeText);
  readonly onboardingImage$ = this._store.select(
    currentSeasonOnboardingImageLink
  );
  readonly currentStep$ = this._store.select(loginStep);

  helpHref = signal('');
  code = '';

  hasEmailedCode = false;
  emailFormCtrl = new FormControl('', [Validators.required, Validators.email]);
  sendEventUpdatesCtrl = new FormControl(true);

  ngOnInit() {
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
          this.login();
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
    const email = this.emailFormCtrl.value;
    if (email && this.code) {
      this._loginService
        .authenticate('', this.code.toUpperCase())
        .pipe(
          tap((result) => {
            console.log(result);
          })
        )
        .subscribe();

      // TODO:
      //     await this.mainUtil.sortProjects();
      //     await this.mainUtil.setParticipantAndDates();
      //     this.mainUtil.setProjectTimesAccordingToTimezones();
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
    }
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
