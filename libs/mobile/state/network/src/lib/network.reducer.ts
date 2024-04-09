import { NetworkState } from './network.interface';
import { createReducer, on } from '@ngrx/store';
import { networkStateChanged, networkSyncingChanged } from './network.actions';

const initialState: NetworkState = {
  isConnected: false,
  isSyncing: false
}

export const networkReducer = createReducer(
  initialState,
  on(networkStateChanged, (state, { isConnected }): NetworkState => ({
    ...state,
    isConnected
  })),
  on(networkSyncingChanged, (state, { syncing }): NetworkState => ({
    ...state,
    isSyncing: syncing
  })),
);
