import { ActivitiesState } from './state.model';
import { createReducer, on } from '@ngrx/store';
import { ActivitiesApiActions } from './activities.actions';
import { selfieUploaded } from '@cockpit/mobile/selfies-state';

const initialState: ActivitiesState = {
  activities: [],
};

export const activitiesReducer = createReducer(
  initialState,
  on(
    ActivitiesApiActions.loadActivitiesSuccess,
    ActivitiesApiActions.loadActivitiesFromStorageSuccess,
    (state, { activities }) => ({
      ...state,
      activities,
    })
  ),
  on(ActivitiesApiActions.createActivity, (state, { activity }) => ({
    ...state,
    activities: [...state.activities, activity],
  })),
  on(
    selfieUploaded,
    (state, { id, link }): ActivitiesState => ({
      ...state,
      activities: state.activities.map((activity) => {
        if (activity.id === id) {
          return { ...activity, image: link };
        }
        return activity;
      }),
    })
  )
);
