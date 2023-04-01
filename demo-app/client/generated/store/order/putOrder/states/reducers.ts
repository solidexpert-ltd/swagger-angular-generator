/* tslint:disable:max-line-length */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {createFeatureSelector, createReducer, on} from '@ngrx/store';

import {HttpErrorResponse} from '@angular/common/http';
import * as actions from './actions';

export interface PutOrderState {
  data: object | null;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialPutOrderState: PutOrderState = {
  data: null,
  loading: false,
  error: null,
};

export const selectorName = 'Order_PutOrder';
export const getPutOrderStateSelector = createFeatureSelector<PutOrderState>(selectorName);

 export const putOrderReducer = createReducer(    initialPutOrderState,
    on(actions.start, (state) => ({...state, loading: true, error: null})),
    on(actions.success, (state,action) => ({...state, data: action.payload, loading: false})),
    on(actions.error, (state,action) => ({...state, error: action.payload, loading: false}))
  );
