/* tslint:disable:max-line-length */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {createFeatureSelector, createReducer, on} from '@ngrx/store';

import {HttpErrorResponse} from '@angular/common/http';
import * as __model from '../../../../model';
import * as actions from './actions';

export interface RestAuthUserUpdateState {
  data: __model.UserDetails | null;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialRestAuthUserUpdateState: RestAuthUserUpdateState = {
  data: null,
  loading: false,
  error: null,
};

export const selectorName = 'RestAuth_RestAuthUserUpdate';
export const getRestAuthUserUpdateStateSelector = createFeatureSelector<RestAuthUserUpdateState>(selectorName);

 export const restAuthUserUpdateReducer = createReducer(    initialRestAuthUserUpdateState,
    on(actions.start, (state) => ({...state, loading: true, error: null})),
    on(actions.success, (state,action) => ({...state, data: action.payload, loading: false})),
    on(actions.error, (state,action) => ({...state, error: action.payload, loading: false}))
  );
