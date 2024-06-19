import { inject, Injectable } from '@angular/core';
import { HttpService } from '@cockpit/mobile/http';
import { User } from '@cockpit/mobile/data-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _http = inject(HttpService);

  getUserByEmailAddress(email: string): Observable<User[]> {
    return this._http.get<User[]>(`/users?email=${email}`);
  }

  sendResetAccessCodeEmail(email: string): Observable<boolean> {
    return this._http.post<{ email: string }, boolean>(
      `/users/access-code/reset`,
      { email }
    );
  }
}
