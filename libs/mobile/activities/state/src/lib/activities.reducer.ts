import { ActivitiesState } from './state.model';
import { createReducer, on } from '@ngrx/store';
import { ActivitiesApiActions } from './activities.actions';

const initialState: ActivitiesState = {
  activities: []
};

export const activitiesReducer = createReducer(
  initialState,
  on(ActivitiesApiActions.loadActivitiesSuccess, ActivitiesApiActions.loadActivitiesFromStorageSuccess, (state, { activities }) => ({ ...state, activities })),
  on(ActivitiesApiActions.createActivity, (state, { activity }) => ({ ...state, activities: [...state.activities, activity] })),
);
