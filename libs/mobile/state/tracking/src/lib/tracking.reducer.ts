import { createReducer, on } from '@ngrx/store';
import { TrackingState } from './state.model';
import { TrackingActions } from './tracking.actions';
import { CurrentTrackedActivity } from '@cockpit/data-models';
import { calculateDistance } from '@cockpit/distance';
import { Location } from '@transistorsoft/capacitor-background-geolocation';

const initialState: TrackingState = {
  currentlyTrackedInfo: undefined
};

export const trackingReducer = createReducer(
  initialState,
  on(TrackingActions.startTrackingSuccess, TrackingActions.trackedActivityFoundInStorage, (state, { activity }) => ({
    ...state,
    currentlyTrackedInfo: activity
  })),
  on(TrackingActions.addLocation, (state, { location }): TrackingState => ({
    ...state,
    currentlyTrackedInfo: state.currentlyTrackedInfo ? addLocation(location, state.currentlyTrackedInfo) : undefined
  })),
  on(TrackingActions.stopTrackingSuccess, (state): TrackingState => ({
    ...state,
    currentlyTrackedInfo: state.currentlyTrackedInfo ? {
      ...state.currentlyTrackedInfo,
      endTime: new Date()
    } : undefined
  })),
  on(TrackingActions.trackedActivityCreated, (state): TrackingState => ({
    ...state,
    currentlyTrackedInfo: undefined
  }))
);

const addLocation = (location: Location, currentInfo?: CurrentTrackedActivity): CurrentTrackedActivity | undefined => {
  if ((location as any).error || !location.coords) {
    return currentInfo ? { ...currentInfo } : undefined;
  }

  if (currentInfo) {
    const { locations } = currentInfo;
    let { distance } = currentInfo;
    if (locations.length) {
      const previousLocation = locations[0];
      const distanceBetween = calculateDistance(previousLocation.lat, previousLocation.long, location.coords.latitude, location.coords.longitude);

      // if (distanceBetween < 0.001) {
      //   return {
      //     ...currentInfo
      //   }
      // }

      distance += distanceBetween;
    }

    return {
      ...currentInfo,
      locations: [{ lat: location.coords.latitude, long: location.coords.longitude }, ...locations],
      distance
    };
  }

  return undefined;
}
