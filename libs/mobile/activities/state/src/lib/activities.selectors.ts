import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActivitiesState } from './state.model';

export const activitiesFeatureSelector = createFeatureSelector<ActivitiesState>('activities');
export const activitiesSelector = createSelector(activitiesFeatureSelector, state => state.activities);
export const sortedActivitiesSelector = createSelector(activitiesSelector, activities => [...activities].sort(((a, b) => b.id - a.id)));
