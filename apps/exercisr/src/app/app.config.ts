import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SQLiteService } from '@cockpit/mobile/sqlite';
import { Capacitor } from '@capacitor/core';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '@cockpit/mobile/environment';
import { environment } from '../environments/environment';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { activitiesReducer } from '@cockpit/mobile/activities-state';
import { trackingReducer } from '@cockpit/mobile/tracking-state';
import { ActivitiesEffects } from '@cockpit/mobile/activities-effects';
import { provideRouterStore } from '@ngrx/router-store';
import { AppInitEffect } from '@cockpit/mobile/app-init-effects';
import { TrackingEffects } from '@cockpit/mobile/tracking-effects';
import { networkReducer } from '@cockpit/mobile/network-state';
import { NetworkSyncEffect } from '@cockpit/mobile/network-sync';
import { SelfiesEffects } from '@cockpit/mobile/selfies-effects';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { loginReducer } from '@cockpit/mobile/state/login';
import { LoginEffects } from '@cockpit/effects-login';
import { InAppBrowserEffects } from '@cockpit/effects-in-app-browser';
import { globalReducer } from '@cockpit/mobile/state/global';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { LocalNotificationsEffect } from '@cockpit/mobile/effects/local-notifications';
import { ShareEffects } from '../../../../libs/mobile/effects/share/src/lib/share.effects';

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export function initDatabase(sqlite: SQLiteService) {
  const platform = Capacitor.getPlatform();

  if (platform === 'web') {
    return async () => {
      await Promise.resolve();
    };
  }

  return async () => {
    sqlite.initializePlugin();
    await sqlite.openDatabase(false, 'no-encryption', 1, false);
    await sqlite.initializeDatabase();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(MatBottomSheetModule),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouterStore(),
    provideStore({
      activities: activitiesReducer,
      tracking: trackingReducer,
      network: networkReducer,
      login: loginReducer,
      global: globalReducer,
    }),
    provideEffects(
      AppInitEffect,
      ActivitiesEffects,
      TrackingEffects,
      NetworkSyncEffect,
      SelfiesEffects,
      LoginEffects,
      InAppBrowserEffects,
      LocalNotificationsEffect,
      ShareEffects
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initDatabase,
      multi: true,
      deps: [SQLiteService],
    },
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    provideStoreDevtools(),
    provideAngularSvgIcon(),
  ],
};
