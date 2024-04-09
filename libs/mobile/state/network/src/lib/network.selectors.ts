import { NetworkState } from './network.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const networkFeatureSelector = createFeatureSelector<NetworkState>('network');
export const networkIsConnectedSelector = createSelector(
  networkFeatureSelector,
  (state: NetworkState) => state.isConnected
);
export const networkIsSyncingSelector = createSelector(
  networkFeatureSelector,
  (state: NetworkState) => state.isSyncing
);
