/* tslint:disable:max-line-length */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {createFeatureSelector, createReducer, on} from '@ngrx/store';

import {HttpErrorResponse} from '@angular/common/http';
import * as actions from './actions';

export interface RestAuthLogoutListState {
  data: void | null;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialRestAuthLogoutListState: RestAuthLogoutListState = {
  data: null,
  loading: false,
  error: null,
};

export const selectorName = 'RestAuth_RestAuthLogoutList';
export const getRestAuthLogoutListStateSelector = createFeatureSelector<RestAuthLogoutListState>(selectorName);

 export const restAuthLogoutListReducer = createReducer(    initialRestAuthLogoutListState,
    on(actions.start, (state) => ({...state, loading: true, error: null})),
    on(actions.success, (state,action) => ({...state, data: action.payload, loading: false})),
    on(actions.error, (state,action) => ({...state, error: action.payload, loading: false}))
  );
