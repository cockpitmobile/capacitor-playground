import { createReducer, on } from '@ngrx/store';
import { GlobalState } from './state.model';
import { GlobalActions } from './global.actions';

const initialState: GlobalState = {
  activityTypes: [],
};

export const globalReducer = createReducer(
  initialState,
  on(
    GlobalActions.loadActivityTypesSuccess,
    GlobalActions.activityTypesLoadedFromStorage,
    (state: GlobalState, { activityTypes }): GlobalState => ({
      ...state,
      activityTypes,
    })
  )
);
