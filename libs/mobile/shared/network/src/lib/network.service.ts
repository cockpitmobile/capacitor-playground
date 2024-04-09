import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { from, map, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { networkStateChanged } from '@cockpit/network-state';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  constructor(
    private readonly store: Store
  ) {}

  setupNetworkListener(): Observable<void> {
    return from(Network.getStatus()).pipe(
      tap(networkStatus => this.store.dispatch(networkStateChanged({ isConnected: networkStatus.connected }))),
      tap(() => this._listenForNetworkChanges()),
      map(() => void 0)
    );
  }

  private _listenForNetworkChanges(): void {
    Network.addListener('networkStatusChange', status => {
      this.store.dispatch(networkStateChanged({ isConnected: status.connected }));
      console.log('NETWORK STATUS');
    });
  }
}
