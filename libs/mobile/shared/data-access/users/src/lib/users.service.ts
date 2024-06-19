import { inject, Injectable } from '@angular/core';
import { HttpService } from '@cockpit/mobile/http';
import { User } from '@cockpit/mobile/data-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _usersService = inject(HttpService);

  getUserByEmailAddress(email: string): Observable<User[]> {
    return this._usersService.get<User[]>(`/users?email=${email}`);
  }
}
