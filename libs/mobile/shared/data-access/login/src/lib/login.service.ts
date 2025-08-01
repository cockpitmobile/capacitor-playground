import { inject, Injectable } from '@angular/core';
import { RAAEvent, User } from '@cockpit/mobile/data-models';
import { AppStorageService } from '@cockpit/mobile/storage';
import { Observable, tap } from 'rxjs';
import { HttpService } from '@cockpit/mobile/http';
import { StorageKey } from '@cockpit/mobile/constants';
import { UsersService } from '@cockpit/mobile-data-access-users';
import { AppService } from '@cockpit/mobile-data-access-app';

interface AuthenticateResponse {
  user: User;
  token: string;
  projects: Array<RAAEvent>;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly _userService = inject(UsersService);
  private readonly _appService = inject(AppService);

  constructor(
    private readonly storage: AppStorageService,
    private readonly _http: HttpService
  ) {}

  authenticate(
    email: string,
    userCode: string
  ): Observable<AuthenticateResponse> {
    return this._http
      .post<
        { password: string; email: string },
        AuthenticateResponse
      >(`/authenticate`, { password: userCode, email })
      .pipe(
        tap((data) => {
          this._userService.setUser(data.user);
          this.storage.setData(StorageKey.TOKEN, data.token);
          this.storage.setData(StorageKey.USER, data.user);
          this.storage.setData(StorageKey.EVENTS, data.projects);
          this._appService.navigateToEvents();
        })
      );
  }
}
