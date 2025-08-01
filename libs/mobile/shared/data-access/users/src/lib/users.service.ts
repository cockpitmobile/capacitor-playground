import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '@cockpit/mobile/http';
import { User } from '@cockpit/mobile/data-models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _http = inject(HttpService);

  public readonly currentUser = signal<User | undefined>(undefined);

  getUserByEmailAddress(email: string): Observable<User[]> {
    return this._http.get<User[]>(`/users?email=${email}`);
  }

  sendResetAccessCodeEmail(email: string): Observable<boolean> {
    return this._http.post<{ email: string }, boolean>(
      `/users/access-code/reset`,
      { email }
    );
  }

  setUser(user: User): void {
    this.currentUser.set(user);
  }

  updateUser(user: User): Observable<User> {
    return this._http.put<User>(`/users/${user.id}`, user).pipe(
      tap((updatedUser) => {
        this.currentUser.set(updatedUser);
      })
    );
  }
}
