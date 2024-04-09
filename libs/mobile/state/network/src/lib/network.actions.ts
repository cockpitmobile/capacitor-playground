import { createAction, props } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';

export const networkStateChanged = createAction(
  '[Network] State Changed',
  props<{ isConnected: boolean }>()
);
export const networkSyncingChanged = createAction(
  '[Network] Syncing Changed',
  props<{ syncing: boolean }>()
);

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectRouteDataParam, // factory function to select a route data param
  selectUrl, // select the current url
  selectTitle, // select the title if available
} = getRouterSelectors();
