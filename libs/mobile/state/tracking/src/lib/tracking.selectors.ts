import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackingState } from './state.model';

export const trackingFeatureSelector = createFeatureSelector<TrackingState>('tracking');
export const currentTrackingInfoSelector = createSelector(trackingFeatureSelector, state => state.currentlyTrackedInfo);
