import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GlobalState } from './state.model';

const featureSelector = createFeatureSelector<GlobalState>('global');

export const allActivityTypes = createSelector(
  featureSelector,
  (state) => state.activityTypes
);

export const allActivityTypesSorted = createSelector(
  allActivityTypes,
  (activityTypes) =>
    [...activityTypes].sort((a, b) => a.name.localeCompare(b.name))
);

export const allFeaturedActivityTypes = createSelector(
  allActivityTypesSorted,
  (activityTypes) =>
    activityTypes.filter((activityType) => activityType.isFeatured)
);
