import { Injectable } from '@angular/core';
import { SQLiteService } from '@cockpit/mobile/sqlite';
import { StorageKey } from '@cockpit/mobile/constants';
import { Capacitor } from '@capacitor/core';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStorageService {
  constructor(private readonly sqlite: SQLiteService) {}

  getData<T>(key: StorageKey): Observable<T | undefined> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      return of(this._getDataLocalStorage<T>(key));
    }
    return from(this.sqlite.getData<T>(key));
  }

  setData<T>(key: StorageKey, value: T): Observable<void> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      this._setDataLocalStorage<T>(key, value);
      return of(void 0);
    }
    return from(this.sqlite.storeData(key, value));
  }

  removeData<T>(key: StorageKey): Observable<void> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      localStorage.removeItem(key);
      return of(void 0);
    }
    return from(this.sqlite.removeData(key));
  }

  private _getDataLocalStorage<T>(key: StorageKey): T | undefined {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return undefined;
  }

  private _setDataLocalStorage<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
