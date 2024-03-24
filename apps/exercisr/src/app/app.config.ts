import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SQLiteService } from '@cockpit/sqlite';
import { Capacitor } from '@capacitor/core';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '@cockpit/environment';
import { environment } from '../environments/environment';

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export function initDatabase(sqlite: SQLiteService) {
  const platform = Capacitor.getPlatform();

  if (platform === 'web') {
    return async () => {
      await Promise.resolve();
    }
  }

  return async () => {
    sqlite.initializePlugin();
    await sqlite.openDatabase(false, 'no-encryption', 1, false);
    await sqlite.initializeDatabase();
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initDatabase,
      multi: true,
      deps: [SQLiteService]
    },
    {
      provide: ENVIRONMENT,
      useValue: environment
    }
  ],
};
