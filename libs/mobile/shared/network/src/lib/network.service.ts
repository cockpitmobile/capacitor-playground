import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private _networkStatus$$ = new BehaviorSubject<boolean>(false);
  public networkStatus$ = this._networkStatus$$.asObservable();

  get isConnected(): boolean {
    return this._networkStatus$$.value;
  }

  async setupNetworkListener(): Promise<void> {
    const status = await Network.getStatus();
    this._networkStatus$$.next(status.connected);
    console.log(status.connected);
    Network.addListener('networkStatusChange', status => {
      this._networkStatus$$.next(status.connected);
      console.log('NETWORK STATUS');
    });
  }
}
